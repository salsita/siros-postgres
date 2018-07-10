const squel = require('squel').useFlavour('postgres');
const Db = require('./db');

class DbQuery extends Db {
  constructor({ url, logger }) {
    super({ url, logger });
    this.name = 'DbQuery';
  }

  async getUsers() {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getUsers() operation in disconnected state`);
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
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getUsers() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async createUser(user) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform createUser() operation in disconnected state`);
      return null;
    }
    const query = squel.insert()
      .into('users')
      .setFields(user)
      .returning('id')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res.id;
    } catch (e) {
      this.logger.error(`[${this.name}] error during createUser() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getUser(id) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getUser() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field('*')
      .field("to_char(start_date, 'YYYY-MM-DD')", 'start_date_str')
      .from('users')
      .where('id = ?', id)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.oneOrNone(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      if (res === null) { return 0; }
      res.start_date = res.start_date_str;
      res.start_date_str = undefined;
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getUser() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async updateUser(id, changes) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform updateUser() operation in disconnected state`);
      return null;
    }
    const query = squel.update()
      .table('users')
      .setFields(changes)
      .where('id = ?', id)
      .returning('id')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res.id;
    } catch (e) {
      this.logger.error(`[${this.name}] error during updateUser() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }
}

module.exports = DbQuery;
