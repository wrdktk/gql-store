const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
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
          id: args.id
        }
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{id title}`);
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
          permissions: { set: ["USER"] }
        }
      },
      info
    );

    // create JWT token for user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // set JWT as cookie on the res obj
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });

    // return user to the browser
    return user;
  },

  async signin(parents, { email, password }, ctx, info) {
    // 1. check if there's a current user
    const user = await ctx.db.query.user({ where: { email } });
    // 2. verify their password

    // 3. generate JWT token
    // 4. set cookie with token
    // 5. return user
  }
};

module.exports = Mutations;
