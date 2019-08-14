const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // checl if there's a current user Id
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info,
    );
  },

  async users(parent, args, ctx, info) {
    // 1. check if logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in');
    }
    // 2. check if the user has permission to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // 3. if they do, query all users
    return ctx.db.user({}, info);
  },
};

module.exports = Query;
