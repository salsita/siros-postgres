const squel = require('squel').useFlavour('postgres');
const Db = require('./db');

class DbQuery extends Db {
  constructor({ url, logger }) {
    super({ url, logger });
    this.name = 'DbQuery';
  }

  async operation(name) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform operation() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .from('table')
      .field('count')
      .where('id = ?', name)
      .toParam();
    let res;
    try {
      res = await this.db.oneOrNone(query);
      return res ? res.count : 0;
    } catch (e) {
      this.logger.error(`[${this.name}] error during updateInvocations() method`);
      return null;
    }
  }
}

module.exports = DbQuery;
