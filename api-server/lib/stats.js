/* eslint-disable max-classes-per-file */

class StatefulRingBuffer {
  // maxSize: how many recent items to keep, when 0 (default, no items) `cbOut` callback is NEVER invoked
  // initialState: object holding the stats to be updated with each items going in/out the buffer
  // cbIn: reducer updating the state when an item is entering the buffer
  // cbOut: reducer updating the state when an item is leaving the buffer
  constructor(maxSize = 0, initialState = {}, cbIn = (state) => (state), cbOut = (state) => (state)) {
    this.maxSize = maxSize;
    this.size = 0;
    this.head = null;
    this.tail = null;
    this.state = initialState;
    this.callbacks = { in: cbIn, out: cbOut };
  }

  push(item) {
    this.state = this.callbacks.in(this.state, item);
    if (this.maxSize < 1) { return; }
    if (this.size < this.maxSize) {
      const element = {
        item,
        prev: null,
      };
      if (!this.head) {
        this.head = element;
        this.tail = element;
      } else {
        this.head.prev = element;
        this.head = element;
      }
      this.size += 1;
      if (this.size === this.maxSize) {
        this.head.prev = this.tail;
      }
    } else {
      this.state = this.callbacks.out(this.state, this.tail.item);
      this.head = this.tail;
      this.tail = this.tail.prev;
      this.head.item = item;
    }
  }

  getState(includeItems = false) {
    if (!includeItems) { return { ...(this.state) }; }
    const arr = [];
    let ptr = this.tail;
    for (let i = 0; i < this.size; i += 1) {
      arr.push(ptr.item);
      ptr = ptr.prev;
    }
    return {
      ...(this.state),
      items: arr,
    };
  }
}

const getSecs = (millis = Date.now()) => Math.floor(millis / 1000);

class Stats {
  // config (all fields are optional):
  // -----
  // pathDepth: how many path segments to track
  //   0: all the paths are tracked together
  //   1: stats are cummulated at 1st path segment (e.g. /auth/google and /auth/facebook will be tracked under /auth)
  //   2: ... cummulated at 2nd path segment
  //   ...
  //   -1 (default): all path segments are used (no cummulation)
  //
  // beforeCb: (ctx) => {}, callback to invoke before executing next() middleware
  //
  // afterCb: (ctx, durationMs) => {}, callback to invoke after next() middleware returns
  //   providing millisecond duration as 2nd argument to the callback call (handy for logging!)
  //
  // pathWhitelist: array of paths (regular expressions) that are to be tracked, all paths are tracked by default
  //
  // pathBlacklist: array of paths (regular expressions) that should be excluded from tracking, none by default
  //
  // recentStats: how many recent individual calls to track, 32 by default
  constructor(config) {
    this.config = {
      pathDepth: (typeof config.pathDepth === 'number') ? config.pathDepth : -1,
      beforeCb: (typeof config.beforeCb === 'function') ? config.beforeCb : () => {},
      afterCb: (typeof config.afterCb === 'function') ? config.afterCb : () => {},
      pathWhitelist: (typeof config.pathWhitelist === 'object') ? config.pathWhitelist : [/\/.*/],
      pathBlacklist: (typeof config.pathBlacklist === 'object') ? config.pathBlacklist : [],
      recentStats: (typeof config.recentStats === 'number') ? config.recentStats : 32,
    };
    if (this.config.recentStats < 1) { this.config.recentStats = 1; }
    this.data = {
      startedAt: getSecs(),
      stats: {},
    };
    this.update = this.update.bind(this);
  }

  // koa middleware to process statictics for given request / response exchange
  async update(ctx, next) {
    this.config.beforeCb(ctx);
    const start = Date.now();
    await next();
    const durationMs = Date.now() - start;
    this.config.afterCb(ctx, durationMs);
    const key = this.getTrackingKey(ctx.path);
    if (key) {
      const stats = this.data.stats[key] || {};
      const statsPerStatus = stats[ctx.status] || new StatefulRingBuffer(
        this.config.recentStats,
        { count: 0, sum: 0, sum2: 0 },
        (state, elem) => ({
          count: state.count + 1,
          sum: state.sum + elem.duration,
          sum2: state.sum2 + elem.duration * elem.duration,
        }),
      );
      statsPerStatus.push({
        ts: getSecs(start),
        duration: durationMs,
      });
      stats[ctx.status] = statsPerStatus;
      this.data.stats[key] = stats;
    }
  }

  // return tracking key (in case we want to track the path, or `null` in case we don't
  getTrackingKey(path) {
    if (!this.config.pathWhitelist.length) { return null; }
    const white = this.config.pathWhitelist.find((rx) => (rx.test(path)));
    if (!white) { return null; }
    const black = this.config.pathBlacklist.find((rx) => (rx.test(path)));
    if (black) { return null; }
    if (this.config.pathDepth === -1) { return path; }
    const segments = path.split('/');
    segments.shift(); // each path starts with leading slash (/)
    const trimmed = segments.slice(0, this.config.pathDepth);
    if (trimmed.length < segments.length) { trimmed.push('*'); }
    return `/${trimmed.join('/')}`;
  }

  // return collected statistics
  get(includeRecentStats = false, resetStats = false) {
    const result = {
      startedAt: this.data.startedAt,
      uptime: getSecs() - this.data.startedAt,
      stats: {},
    };
    const { stats } = this.data;
    Object.keys(stats).forEach((path) => {
      result.stats[path] = {};
      const pathStats = stats[path];
      Object.keys(pathStats).forEach((status) => {
        const raw = stats[path][status].getState(includeRecentStats);
        const mean = raw.sum / raw.count;
        const std = Math.sqrt(raw.sum2 / raw.count - mean * mean);
        const res = {
          count: raw.count,
          mean: parseFloat(mean.toFixed(2)),
          std: parseFloat(std.toFixed(2)),
        };
        if (raw.items) { res.items = raw.items; }
        result.stats[path][status] = res;
      });
    });
    if (resetStats) { this.reset(); }
    return result;
  }

  reset() {
    this.data = {
      startedAt: getSecs(),
      stats: {},
    };
  }
}

module.exports = {
  Stats,
};
