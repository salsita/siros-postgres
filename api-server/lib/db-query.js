const squel = require('squel').useFlavour('postgres');
const Db = require('./db');

class DbQuery extends Db {
  constructor({ url, logger }) {
    super({ url, logger });
    this.name = 'DbQuery';
  }

  async getHwList(userEmail) {
    const cl = await this.client();

    const query = squel.select()
      .field('h.id', 'id')
      .field('c.category', 'category')
      .field('h.description', 'description')
      .field('s.store', 'store')
      .field("to_char(h.purchase_date, 'YYYY-MM-DD')", 'purchase_date')
      .field('h.purchase_price', 'purchase_price')
      .field('h.condition', 'condition')
      .field('h.max_price', 'max_price')
      .field('h.active', 'active')
      .field('h.available', 'available')
      .field('h.comment', 'comment')
      .from('hw', 'h')
      .join('hw_categories', 'c', 'h.category = c.id')
      .join('stores', 's', 'h.store = s.id')
      .join('users', 'u', 'h.user_id = u.id')
      .where('u.email = ?', userEmail)
      .order('h.active', false)
      .order('h.purchase_date', false)
      .toParam();

    const res = await cl.q(query, `getHwList(email: ${userEmail})`);
    cl.release();
    return res;
  }

  async getHwBudget(userEmail) {
    const cl = await this.client();

    try {
      const query = squel.select()
        .field('b.action')
        .field('b.amount')
        .field('b.hw_owner_history_id')
        .field('b.hw_repairs_id')
        .field("to_char(b.date, 'YYYY-MM-DD')", 'date')
        .from('hw_budgets', 'b')
        .join('users', 'u', 'b.user_id = u.id')
        .where('u.email = ?', userEmail)
        .order('date', false)
        .toParam();

      const res = await cl.q(query, `getHwBudget(email: ${userEmail})`);

      let total = 0;
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < res.length; i += 1) {
        const item = res[i];
        total += item.amount;
        if (item.hw_owner_history_id) { item.hw = await this.getHwChangeDetails(cl, item.hw_owner_history_id); }
        item.hw_owner_history_id = undefined;
        if (item.hw_repairs_id) { item.hw = await this.getHwRepairDetails(cl, item.hw_repairs_id); }
        item.hw_repairs_id = undefined;
      }

      cl.release();

      return {
        total,
        items: res,
      };
    } catch (e) {
      cl.release();
      throw e;
    }
  }

  async getHwChangeDetails(client, historyId) {
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

    return (await client.q(query, `getHwChangeDetails(client, historyId: ${historyId})`))[0];
  }

  async getHwRepairDetails(client, repairId) {
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

    return (await client.q(query, `getHwRepairDetails(client, repairId: ${repairId})`))[0];
  }

  async getMarketplace() {
    const cl = await this.client();

    const query = squel.select()
      .field('h.id', 'id')
      .field('c.category', 'category')
      .field('h.description', 'description')
      .field('s.store', 'store')
      .field("to_char(h.purchase_date, 'YYYY-MM-DD')", 'purchase_date')
      .field('h.purchase_price', 'purchase_price')
      .field('h.condition', 'condition')
      .field('h.max_price', 'max_price')
      .field('h.comment', 'comment')
      .from('hw', 'h')
      .join('hw_categories', 'c', 'h.category = c.id')
      .join('stores', 's', 'h.store = s.id')
      .join('users', 'u', 'h.user_id = u.id')
      .where('h.active =?', true)
      .where('h.available =?', true)
      .order('h.purchase_date', false)
      .toParam();

    const res = await cl.q(query, 'getMarketplace()');
    cl.release();
    return res;
  }
}

module.exports = DbQuery;
