const config = require('./config');

const getBudgetUpdates = (user, history, today) => {
  const updates = [];
  let rule = config.budget.pickRule(user.start_date);
  if (!rule) { return updates; }
  // always include the initial amount
  if (!history.length) {
    const amount = rule.initial[user.part_time ? 'partTime' : 'fullTime'];
    if (amount) {
      updates.push({
        action: 'initial',
        amount,
        date: user.start_date,
      });
    }
  }
  // when do the yearly refreshes start?
  let offset = 1;
  if (rule.name === config.budget.names.PERIOD2) { offset = 2; }
  //
  let year = parseInt(user.start_date.split('-')[0], 10) + offset;
  const lastRecord = (history.length ? history[history.length - 1].date : user.start_date);
  const startDate = user.start_date.split('-');
  let anniversary = `${year}-${startDate[1]}-${startDate[2]}`;
  while (anniversary <= today) {
    if (anniversary > lastRecord) {
      rule = config.budget.pickRule(anniversary);
      const amount = rule.yearly[user.part_time ? 'partTime' : 'fullTime'];
      if (amount) {
        updates.push({
          action: 'yearly',
          amount,
          date: anniversary,
        });
      }
    }
    year += 1;
    anniversary = `${year}-${startDate[1]}-${startDate[2]}`;
  }
  return updates;
};

module.exports = { getBudgetUpdates };
