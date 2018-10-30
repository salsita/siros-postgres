module.exports = [
  {
    path: '/hw-list',
    method: 'get',
    handler: async (ctx) => {
      ctx.body = {
        items: await ctx.db.getHwList(ctx.state.user.email),
      };
    },
  },
];
