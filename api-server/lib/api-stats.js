const dependency = {
  stats: null,
};

module.exports = [
  {
    name: 'get/api-stats',
    setDependencies: (deps) => { dependency.stats = deps.stats; },
    path: '/stats',
    method: 'get',
    handler: (ctx) => {
      if (dependency.stats) {
        ctx.body = dependency.stats.get(
          ctx.request.query.recent && (ctx.request.query.recent === 'true'),
          ctx.request.query.reset && (ctx.request.query.reset === 'true'),
        );
      } else {
        ctx.status = 500;
      }
    },
  },
];
