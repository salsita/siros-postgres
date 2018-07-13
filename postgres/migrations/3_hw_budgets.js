exports.up = (pgm) => {
  pgm.createType(
    'type_budget_action',
    ['initial', 'yearly', 'correction', 'hw_buy', 'hw_sell', 'hw_repair'],
  );
  pgm.createTable(
    'hw_budgets',
    {
      user_id: {
        type: 'integer',
        notNull: true,
        references: 'users (id)',
        comment: 'for what user is the budget update for (foreign key to table users)',
      },
      action: {
        type: 'type_budget_action',
        notNull: true,
        comment: 'one of the prefefined actions',
      },
      amount: {
        type: 'integer',
        notNull: true,
        comment: 'budget update amount',
      },
      hw_owner_history_id: {
        type: 'integer',
        notNull: false,
        references: 'hw_owner_history (id)',
        check: "(((action = 'initial' or action = 'yearly' or action = 'correction' or action = 'hw_repair') and (hw_owner_history_id is null)) or "
             + " ((action = 'hw_buy'  or action = 'hw_sell') and (hw_owner_history_id is not null)))",
        comment: 'link to hw_owner_history table when user is charged for hw when buying / selling it',
      },
      hw_repairs_id: {
        type: 'integer',
        notNull: false,
        references: 'hw_repairs (id)',
        check: "(((action = 'initial' or action = 'yearly' or action = 'correction' or action = 'hw_buy' or action = 'hw_sell') and (hw_repairs_id is null)) or "
             + " ((action = 'hw_repair') and (hw_repairs_id is not null)))",
        comment: 'link to hw_repairs table when user is charged for hw repair',
      },
      date: {
        type: 'date',
        notNull: false,
        default: pgm.func('now()::date'),
        comment: 'ISO 8601 format, YYYY-MM-DD',
      },
    },
    {
      comment: 'hw-budget amounts',
    },
  );
  // search hw budget items for given user
  pgm.createIndex('hw_budgets', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropIndex('hw_budgets', 'user_id');
  pgm.dropTable('hw_budgets');
  pgm.dropType('type_budget_action');
};
