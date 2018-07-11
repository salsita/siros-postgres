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

  async getBudgetUsers() {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getBudgetUsers() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field('id')
      .field('name')
      .field("to_char(start_date, 'YYYY-MM-DD')", 'start_date')
      .field('part_time')
      .from('users')
      .where('system = false')
      .where('active = true')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getBudgetUsers() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getHwBudgetItems(userId, types) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwBudgetItems() operation in disconnected state`);
      return null;
    }
    let query = squel.select()
      .field('action')
      .field('amount')
      .field('hw_history_id')
      .field("to_char(date, 'YYYY-MM-DD')", 'date')
      .from('hw_budgets')
      .where('user_id = ?', userId);
    if (types === 'initial-yearly') { query = query.where("action = 'initial' OR action = 'yearly'"); }
    query = query
      .order('date')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwBudgetItems() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async addHwBudget(userId, updates) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform addHwBudget() operation in disconnected state`);
      return null;
    }
    updates.forEach((item) => {
      item.user_id = userId;
      item.hw_history_id = null;
    });
    const query = squel.insert()
      .into('hw_budgets')
      .setFieldsRows(updates)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.none(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return true;
    } catch (e) {
      this.logger.error(`[${this.name}] error during addHwBudget() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getHwDetailFromHistory(historyId) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwDetailFromHistory() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field('hw_categories.category', 'category')
      .field('stores.store', 'store')
      .field('hw.description', 'description')
      .from('hw_history')
      .join('hw', null, 'hw_history.hw_id = hw.id')
      .join('hw_categories', null, 'hw.category = hw_categories.id')
      .join('stores', null, 'hw.store = stores.id')
      .where('hw_history.id = ?', historyId)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwDetailFromHistory() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }
}

module.exports = DbQuery;
