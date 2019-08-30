const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
// promisfy from node util lib to turn callback based functions (crypto) into promise based funcs

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // This is how we create a relationship between item and user
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info,
    );
    return item;
  },

  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove id from the updates
    delete updates.id;
    // run the updates method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info,
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    // 1. find the item
    const item = await ctx.db.query.item({ where }, '{id title}');
    // 2. check if user owns item / has permission to delete item
    // TODO
    // 3. delete item
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // hash user password
    const password = await bcrypt.hash(args.password, 10);
    // create user in db
    const user = ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info,
    );

    // create JWT token for user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // set JWT as cookie on the res obj
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    // return user to the browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there's a current user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for ${email}`);
    }
    // 2. verify their password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    // 3. generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. set cookie with token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    // 5. return user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return {
      message: 'Later, alligator!',
    };
  },

  async requestReset(parent, args, ctx, info) {
    // 1. check if user is real
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for ${args.email}`);
    }
    // 2. set a token and expiry on that user
    const randomBytesPromisfied = promisify(randomBytes);
    const resetToken = (await randomBytesPromisfied(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 360000; // an hour from now
    const res = ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });
    // 3. email them reset token
    const mailRes = await transport.sendMail({
      from: 'wardamk@gmail.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${
  process.env.FRONTEND_URL
}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
    });

    // 4. Return the message
    return { message: 'Thanks!' };
  },

  async requestPassword(parent, args, ctx, info) {
    // 1. check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error('Password do not match');
    }
    // 2. check if legit reset token
    // 3. check if it's expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired');
    }
    // 4. hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: {
        email: user.email,
      },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. set the new JWT
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    // 8. return the new user
    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    // query the current user
  },
};

module.exports = Mutations;
