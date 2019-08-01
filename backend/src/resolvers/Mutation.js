const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      },
    }, info);
    return item;
  },

  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove id from the updates
    delete updates.id;
    // run the updates method
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      },
    }, info);
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{id title}`);
    // 2. check if user owns item / has permission to delete item
    //TODO
    // 3. delete item
    return ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = Mutations;
