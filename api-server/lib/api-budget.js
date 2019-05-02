module.exports = [
  {
    path: '/budget',
    method: 'get',
    handler: async (ctx) => { ctx.body = await ctx.db.getBudget(ctx.state.user.email); },
  },
];
