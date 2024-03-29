const squel = require('squel').useFlavour('postgres');
const config = require('./config');
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
      .field('part_time')
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
      .order('name')
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

  async getBudgetItems(userId, types) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getBudgetItems() operation in disconnected state`);
      return null;
    }
    let query = squel.select()
      .field('action')
      .field('amount')
      .field('hw_owner_history_id')
      .field('hw_repairs_id')
      .field('education_id')
      .field("to_char(date, 'YYYY-MM-DD')", 'date')
      .from('budgets')
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
      this.logger.error(`[${this.name}] error during getBudgetItems() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getHwChangeDetails(historyId) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwChangeDetails() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field('u1.name', 'old_user')
      .field('u2.name', 'new_user')
      .field('c.category', 'category')
      .field('h.description', 'description')
      .field('hist.condition', 'condition')
      .field('s.store', 'store')
      .field('h.id', 'id')
      .from('hw_owner_history', 'hist')
      .join('users', 'u1', 'hist.old_user_id = u1.id')
      .join('users', 'u2', 'hist.new_user_id = u2.id')
      .join('hw', 'h', 'hist.hw_id = h.id')
      .join('hw_categories', 'c', 'c.id = h.category')
      .join('stores', 's', 's.id = h.store')
      .where('hist.id = ?', historyId)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwChangeDetails() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getHwRepairDetails(repairId) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwRepairDetails() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field('c.category', 'category')
      .field('h.description', 'description')
      .field('s.store', 'store')
      .field('h.id', 'id')
      .field('r.description', 'repair_description')
      .from('hw_repairs', 'r')
      .join('hw', 'h', 'r.hw_id = h.id')
      .join('hw_categories', 'c', 'c.id = h.category')
      .join('stores', 's', 's.id = h.store')
      .where('r.id = ?', repairId)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwRepairDetails() method`);
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
      item.hw_owner_history_id = null;
      item.hw_repairs_id = null;
    });
    const query = squel.insert()
      .into('budgets')
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

  async getHwCategories() {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwCategories() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .from('hw_categories')
      .field('id')
      .field('category')
      .order('category')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwCategories() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async createHwCategory(category) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform createHwCategory() operation in disconnected state`);
      return null;
    }
    const query = squel.insert()
      .into('hw_categories')
      .setFields(category)
      .returning('id')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res.id;
    } catch (e) {
      this.logger.error(`[${this.name}] error during createHwCategory() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getStores() {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getStores() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .from('stores')
      .field('id')
      .field('store')
      .order('store')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getStores() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async createStore(store) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform createStore() operation in disconnected state`);
      return null;
    }
    const query = squel.insert()
      .into('stores')
      .setFields(store)
      .returning('id')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res.id;
    } catch (e) {
      this.logger.error(`[${this.name}] error during createStore() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async createHw(hw) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform createHw() operation in disconnected state`);
      return null;
    }
    const query = squel.insert()
      .into('hw')
      .setFields(hw)
      .returning('id')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res.id;
    } catch (e) {
      this.logger.error(`[${this.name}] error during createHw() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getHw(where = {}) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHw() operation in disconnected state`);
      return null;
    }
    let query = squel.select()
      .field('h.id', 'id')
      .field('c.category', 'category')
      .field('h.description', 'description')
      .field('s.store', 'store')
      .field("to_char(h.purchase_date, 'YYYY-MM-DD')", 'purchase_date')
      .field('h.purchase_price', 'purchase_price')
      .field('h.condition', 'condition')
      .field('u.name', 'user')
      .field('h.max_price', 'max_price')
      .field('h.active', 'active')
      .field('h.available', 'available')
      .field('h.comment', 'comment')
      .field('h.serial_id', 'serial_id')
      .from('hw', 'h')
      .join('hw_categories', 'c', 'h.category = c.id')
      .join('stores', 's', 'h.store = s.id')
      .join('users', 'u', 'h.user_id = u.id');
    Object.keys(where).forEach((key) => { query = query.where(`${key} = ?`, where[key]); });
    query = query
      .order('h.active')
      .order('h.purchase_date')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHw() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getHwDetails(id) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwDetails() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field('h.id', 'id')
      .field('h.category', 'category_id')
      .field('c.category', 'category')
      .field('h.description', 'description')
      .field('h.store', 'store_id')
      .field('s.store', 'store')
      .field("to_char(h.purchase_date, 'YYYY-MM-DD')", 'purchase_date')
      .field('h.purchase_price', 'purchase_price')
      .field('h.store_invoice_id', 'store_invoice_id')
      .field('h.serial_id', 'serial_id')
      .field('h.condition', 'condition')
      .field('h.user_id', 'user_id')
      .field('u.name', 'user')
      .field('h.inventory_id', 'inventory_id')
      .field('h.max_price', 'max_price')
      .field('h.active', 'active')
      .field('h.available', 'available')
      .field('h.comment', 'comment')
      .from('hw', 'h')
      .join('hw_categories', 'c', 'h.category = c.id')
      .join('stores', 's', 'h.store = s.id')
      .join('users', 'u', 'h.user_id = u.id')
      .where('h.id = ?', id)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwDetails() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getHwOwners(id) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwOwners() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field("to_char(h.date, 'YYYY-MM-DD')", 'date')
      .field('u1.name', 'old_user')
      .field('u2.name', 'new_user')
      .field('h.condition', 'condition')
      .field('h.amount', 'amount')
      .from('hw_owner_history', 'h')
      .join('users', 'u1', 'h.old_user_id = u1.id')
      .join('users', 'u2', 'h.new_user_id = u2.id')
      .where('hw_id = ?', id)
      .order('date')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwOwners() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getHwRepairs(id) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwRepairs() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field("to_char(h.date, 'YYYY-MM-DD')", 'date')
      .field('u.name', 'user')
      .field('h.amount', 'amount')
      .field('h.description', 'description')
      .from('hw_repairs', 'h')
      .join('users', 'u', 'h.user_id = u.id')
      .where('hw_id = ?', id)
      .order('date')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwRepairs() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async updateHw(id, changes) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform updateHw() operation in disconnected state`);
      return null;
    }
    const query = squel.update()
      .table('hw')
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
      this.logger.error(`[${this.name}] error during updateHw() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async runInTransaction(query) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform "${query.name}" operation in runInTransaction(): disconnected state`);
      return null;
    }
    try {
      this.logger.debug(`[${this.name}] running "${query.name}" in transaction, db query: ${JSON.stringify(query.query, null, 2)}`);
      let res = await this.db[query.method](query.query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      if (query.method === 'none' && res === null) { res = true; }
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error in transaction, part "${query.name}" failed`);
      this.logger.error(`[${this.name}] ${e.message}`);
      try {
        await this.db.none({ text: 'ROLLBACK', values: [] });
      } catch (f) {
        // pass
      }
      return null;
    }
  }

  async transferHw(options) {
    let res;

    res = await this.runInTransaction({
      name: 'begin transaction',
      method: 'none',
      query: {
        text: 'BEGIN',
        values: [],
      },
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'update hw table (user, condition, available)',
      method: 'none',
      query: squel.update()
        .table('hw')
        .setFields({
          user_id: options.newUser,
          condition: (options.condition === 'new' ? 'used' : options.condition),
          available: options.newUser === config.hwItems.systemUserId,
        })
        .where('id = ?', options.id)
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'create record in hw_owner_history',
      method: 'one',
      query: squel.insert()
        .into('hw_owner_history')
        .setFields({
          hw_id: options.id,
          old_user_id: options.oldUser,
          new_user_id: options.newUser,
          amount: options.price,
          date: options.date,
          condition: options.condition,
        })
        .returning('id')
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'update budgets',
      method: 'none',
      query: squel.insert()
        .into('budgets')
        .setFieldsRows([
          // seller
          {
            user_id: options.oldUser,
            action: 'hw_sell',
            amount: options.price,
            hw_owner_history_id: res.id,
            date: options.date,
          },
          // buyer
          {
            user_id: options.newUser,
            action: 'hw_buy',
            amount: -options.price,
            hw_owner_history_id: res.id,
            date: options.date,
          },
        ])
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'commit transaction',
      method: 'none',
      query: {
        text: 'COMMIT',
        values: [],
      },
    });
    if (!res) { return null; }

    return options.id;
  }

  async sellHw(options) {
    let res;

    res = await this.runInTransaction({
      name: 'begin transaction',
      method: 'none',
      query: {
        text: 'BEGIN',
        values: [],
      },
    });
    if (!res) { return null; }

    const fields = {
      user_id: options.newUser,
      available: false,
      active: false,
    };
    if (options.setComment) { fields.comment = options.comment; }
    res = await this.runInTransaction({
      name: 'update hw table (user, available, active)',
      method: 'none',
      query: squel.update()
        .table('hw')
        .setFields(fields)
        .where('id = ?', options.id)
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'create record in hw_owner_history',
      method: 'one',
      query: squel.insert()
        .into('hw_owner_history')
        .setFields({
          hw_id: options.id,
          old_user_id: options.oldUser,
          new_user_id: options.newUser,
          amount: options.price,
          date: options.date,
          condition: options.condition,
        })
        .returning('id')
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'update budgets',
      method: 'none',
      query: squel.insert()
        .into('budgets')
        .setFields({
          user_id: options.oldUser,
          action: 'hw_repurchase',
          amount: options.price,
          hw_owner_history_id: res.id,
          date: options.date,
        })
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'commit transaction',
      method: 'none',
      query: {
        text: 'COMMIT',
        values: [],
      },
    });
    if (!res) { return null; }

    return options.id;
  }

  async repairHw(options) {
    let res;

    res = await this.runInTransaction({
      name: 'begin transaction',
      method: 'none',
      query: {
        text: 'BEGIN',
        values: [],
      },
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'update hw table (condition)',
      method: 'none',
      query: squel.update()
        .table('hw')
        .setFields({ condition: 'repaired' })
        .where('id = ?', options.id)
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'create record in hw_repairs',
      method: 'one',
      query: squel.insert()
        .into('hw_repairs')
        .setFields({
          hw_id: options.id,
          user_id: options.chargeUser,
          amount: options.price,
          date: options.date,
          description: options.description,
        })
        .returning('id')
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'update budgets',
      method: 'none',
      query: squel.insert()
        .into('budgets')
        .setFields({
          user_id: options.chargeUser,
          action: 'hw_repair',
          amount: -options.price,
          hw_repairs_id: res.id,
          date: options.date,
        })
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'commit transaction',
      method: 'none',
      query: {
        text: 'COMMIT',
        values: [],
      },
    });
    if (!res) { return null; }

    return options.id;
  }

  async getHwProtocolDates(userId) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwProtocolDates() operation in disconnected state`);
      return null;
    }
    let res1;
    let res2;
    // hw_buy OR hw_sell
    const query1 = squel.select()
      .field('action')
      .field("to_char(date, 'YYYY-MM-DD')", 'date')
      .from('budgets')
      .where('user_id = ?', userId)
      .where("action = 'hw_buy' OR action = 'hw_sell'")
      .order('date')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query1: ${JSON.stringify(query1, null, 2)}`);
      res1 = await this.db.any(query1);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res1, null, 2)}`);
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwProtocolDates() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
    // hw_repurchase
    const query2 = squel.select()
      .field('b.action', 'action')
      .field("to_char(b.date, 'YYYY-MM-DD')", 'date')
      .from('budgets', 'b')
      .join('hw_owner_history', 'h', 'b.hw_owner_history_id = h.id')
      .where("b.action = 'hw_repurchase'")
      .where('h.new_user_id = ?', userId)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query2: ${JSON.stringify(query2, null, 2)}`);
      res2 = await this.db.any(query2);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res2, null, 2)}`);
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwProtocolDates() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
    if (!res2.length) { return res1; }
    const result = res1.concat(res2).sort((a, b) => {
      if (a.date < b.date) { return -1; }
      if (a.date > b.date) { return 1; }
      return 0;
    });
    return result;
  }

  async getHwProtocolItems(userId, date, type) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getHwProtocolItems() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field('c.category', 'category')
      .field('hw.description', 'description')
      .field('s.store', 'store')
      .field("to_char(hw.purchase_date, 'YYYY-MM-DD')", 'purchase_date')
      .field('hw.purchase_price', 'purchase_price')
      .field('hw.store_invoice_id', 'store_invoice_id')
      .field('hw.serial_id', 'serial_id')
      .field('hist.amount', 'amount')
      .field('hist.condition', 'condition')
      .from('budgets', 'b')
      .join('hw_owner_history', 'hist', 'hist.id = b.hw_owner_history_id')
      .join('hw', 'hw', 'hw.id = hist.hw_id')
      .join('hw_categories', 'c', 'c.id = hw.category')
      .join('stores', 's', 's.id = hw.store')
      .where((type === 'hw_repurchase') ? 'hist.new_user_id = ?' : 'b.user_id = ?', userId)
      .where('b.date = ?', date)
      .where('b.action = ?', type)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getHwProtocolItems() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async discardHw(options) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform discardHw() operation in disconnected state`);
      return null;
    }
    const query = squel.update()
      .table('hw')
      .setFields({
        condition: 'discarded',
        active: false,
        available: false,
        comment: options.description,
      })
      .where('id = ?', options.id)
      .returning('id')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res.id;
    } catch (e) {
      this.logger.error(`[${this.name}] error during discardHw() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getEduEvents(options = {}) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getEduEvents() operation in disconnected state`);
      return null;
    }
    let query = squel.select()
      .field('e.id', 'id')
      .field("to_char(e.date, 'YYYY-MM-DD')", 'date')
      .field('c.category', 'category')
      .field('u.name', 'name')
      .field('e.amount', 'amount')
      .field('e.description', 'description')
      .from('education', 'e')
      .join('users', 'u', 'e.user_id = u.id')
      .join('edu_categories', 'c', 'c.id = e.category');
    if (options.userId !== undefined) { query = query.where('e.user_id = ?', options.userId); }
    if (options.categoryId !== undefined) { query = query.where('e.category = ?', options.categoryId); }
    if (options.fromDate !== undefined) { query = query.where('e.date >= ?', options.fromDate); }
    if (options.toDate !== undefined) { query = query.where('e.date <= ?', options.toDate); }
    query = query
      .order('e.date')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getEduEvents() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getEduCategories() {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getEduCategories() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .from('edu_categories')
      .field('id')
      .field('category')
      .order('category')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.any(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getEduCategories() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async createEduCategory(category) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform createEduCategory() operation in disconnected state`);
      return null;
    }
    const query = squel.insert()
      .into('edu_categories')
      .setFields(category)
      .returning('id')
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res.id;
    } catch (e) {
      this.logger.error(`[${this.name}] error during createEduCategory() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async getEduCategory(id) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getEduCategory() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field('category')
      .from('edu_categories')
      .where('id = ?', id)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.oneOrNone(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      if (res === null) { return 0; }
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getEduCategory() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async createEduEvent(options) {
    let res;

    res = await this.runInTransaction({
      name: 'begin transaction',
      method: 'none',
      query: {
        text: 'BEGIN',
        values: [],
      },
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'create record in education table',
      method: 'one',
      query: squel.insert()
        .into('education')
        .setFields({
          category: options.categoryId,
          description: options.description,
          amount: options.amount,
          user_id: options.userId,
          date: options.date,
          invoice_id: options.invoiceId,
        })
        .returning('id')
        .toParam(),
    });
    if (!res) { return null; }
    const resId = res.id;

    res = await this.runInTransaction({
      name: 'update budgets',
      method: 'none',
      query: squel.insert()
        .into('budgets')
        .setFields({
          user_id: options.userId,
          action: 'education',
          amount: -options.amount,
          education_id: resId,
          date: options.date,
        })
        .toParam(),
    });
    if (!res) { return null; }

    res = await this.runInTransaction({
      name: 'commit transaction',
      method: 'none',
      query: {
        text: 'COMMIT',
        values: [],
      },
    });
    if (!res) { return null; }

    return resId;
  }

  async getEduDetails(eduId) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform getEduDetails() operation in disconnected state`);
      return null;
    }
    const query = squel.select()
      .field('e.category', 'category_id')
      .field('c.category', 'category_name')
      .field('e.description', 'description')
      .field('e.invoice_id', 'invoice_id')
      .field('e.id', 'id')
      .from('education', 'e')
      .join('edu_categories', 'c', 'c.id = e.category')
      .where('e.id = ?', eduId)
      .toParam();
    try {
      this.logger.debug(`[${this.name}] db query: ${JSON.stringify(query, null, 2)}`);
      const res = await this.db.one(query);
      this.logger.debug(`[${this.name}] db response: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (e) {
      this.logger.error(`[${this.name}] error during getEduDetails() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }

  async updateEduEvent(id, changes) {
    if (!this.connected) {
      this.logger.error(`[${this.name}] cannot perform updateEduEvent() operation in disconnected state`);
      return null;
    }
    const query = squel.update()
      .table('education')
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
      this.logger.error(`[${this.name}] error during updateEduEvent() method`);
      this.logger.error(`[${this.name}] ${e.message}`);
      return null;
    }
  }
}

module.exports = DbQuery;
