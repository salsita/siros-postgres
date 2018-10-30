const { Pool } = require('pg');
const { DbError } = require('./errors');

class Db {
  constructor({ url, logger }) {
    this.name = 'Db';
    this.url = url;
    this.logger = logger;
    if (!url) {
      logger.error(`[${this.name}] no URL provided`);
    }
    this.pool = new Pool({
      connectionString: url,
      connectionTimeoutMillis: 10000, // 10 seconds
    });
  }

  // @return pg.Client object, or throw exception on error
  // clients returned with with function must be release()d when finished!
  async client() {
    try {
      this.logger.debug(`[${this.name}] getting DB connection from pool ...`);
      const now = Date.now();
      const cl = await this.pool.connect();
      this.logger.debug(`[${this.name}] ... got one in ${Date.now() - now}ms`);
      if (!cl.q) {
        // @return pg.Result.rows array, or throw exceptionon error
        cl.q = async (query, fnName) => {
          try {
            this.logger.debug(`[${this.name}] <${fnName}> query: ${JSON.stringify(query, null, 2)}`);
            const start = Date.now();
            const res = (await cl.query(query)).rows;
            // eslint-disable-next-line max-len
            this.logger.debug(`[${this.name}] <${fnName}> response in ${Date.now() - start}ms: ${JSON.stringify(res, null, 2)}`);
            return res;
          } catch (f) {
            throw new DbError(`<${fnName}>: ${f.message}`);
          }
        };
      }
      return cl;
    } catch (e) {
      let message = 'cannot get pg.Client from pg.Pool';
      message += ` (total: ${this.pool.totalCount}, idle: ${this.pool.idleCount})`;
      message += `; reason: ${e.message}`;
      throw new DbError(message);
    }
  }
}

module.exports = Db;
