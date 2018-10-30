module.exports = [
  {
    path: '/market',
    method: 'get',
    handler: async (ctx) => {
      ctx.body = {
        items: await ctx.db.getMarketplace(),
      };
    },
  },
];
