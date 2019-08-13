const { forwardTo } = require('prisma-binding');
const { hasPermissions } = require('../utils');

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
    hasPermissions(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
  },
};

module.exports = Query;
