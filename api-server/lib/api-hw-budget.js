module.exports = [
  {
    path: '/hw-budget',
    method: 'get',
    handler: async (ctx) => {
      ctx.body = {
        items: await ctx.db.getHwBudget(ctx.state.user.email),
      };
    },
  },
];
