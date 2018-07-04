const squel = require('squel').useFlavour('postgres');
const Db = require('./db');

class DbQuery extends Db {
  constructor({ url, logger }) {
    super({ url, logger });
    this.name = 'DbQuery';
  }

  async getUsers() {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform operation() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .from('users')
      .field('id')
      .field('name')
      .field('system')
      .field('active')
      .order('name')
      .toParam();
    let res;
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getUsers() method`);
      return null;
    }
  }
}

module.exports = DbQuery;
