module.exports = [
  {
    path: '/me',
    method: 'get',
    handler: (ctx) => { ctx.body = ctx.state.user; },
  },
];
