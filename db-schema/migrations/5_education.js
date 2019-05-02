exports.up = (pgm) => {
  pgm.renameTable('hw_budgets', 'budgets');
  pgm.dropConstraint('budgets', 'hw_budgets_check');
  pgm.addConstraint(
    'budgets',
    'budgets_check',
    {
      check: "(((action = 'initial' or action = 'yearly' or action = 'correction' or action = 'hw_repair' or action = 'education') and (hw_owner_history_id is null)) or"
           + " ((action = 'hw_buy' or action = 'hw_sell' or action = 'hw_repurchase') and (hw_owner_history_id is not null)))",
    },
  );
  pgm.dropConstraint('budgets', 'hw_budgets_check1');
  pgm.addConstraint(
    'budgets',
    'budgets_check1',
    {
      check: "(((action != 'hw_repair') and (hw_repairs_id is null)) or"
           + " ((action  = 'hw_repair') and (hw_repairs_id is not null)))",
    },
  );
  pgm.renameConstraint('budgets', 'hw_budgets_hw_owner_history_id_fkey', 'budgets_hw_owner_history_id_fkey');
  pgm.renameConstraint('budgets', 'hw_budgets_hw_repairs_id_fkey', 'budgets_hw_repairs_id_fkey');
  pgm.renameConstraint('budgets', 'hw_budgets_user_id_fkey', 'budgets_user_id_fkey');

  pgm.createTable(
    'edu_categories',
    {
      id: {
        type: 'serial',
        unique: true,
        primaryKey: true,
        notNull: true,
        comment: 'auto-incremented id',
      },
      category: {
        type: 'varchar(64)',
        unique: true,
        notNull: true,
        comment: 'actual name of the category',
      },
    },
    {
      comment: 'education categories (conference, ...)',
    },
  );
  // lookup id or sort by category name
  pgm.createIndex('edu_categories', 'category');

  pgm.createTable(
    'education',
    {
      id: {
        type: 'serial',
        unique: true,
        primaryKey: true,
        notNull: true,
        comment: 'auto-incremented id',
      },
      category: {
        type: 'integer',
        notNull: true,
        references: 'edu_categories (id)',
        comment: 'education category',
      },
      description: {
        type: 'varchar(512)',
        notNull: true,
        comment: 'description of the education event',
      },
      // for reports
      amount: {
        type: 'integer',
        notNull: true,
        comment: 'cost of the education event',
      },
      user_id: {
        type: 'integer',
        notNull: true,
        references: 'users (id)',
        comment: 'who is charged for the education event',
      },
      date: {
        type: 'date',
        notNull: true,
        default: pgm.func('now()::date'),
        comment: 'date of charge, ISO 8601 format, YYYY-MM-DD',
      },
    },
    {
      comment: 'track of all education expenses',
    },
  );
  // lookup or sort by date (rather period)
  pgm.createIndex('education', 'date');

  pgm.addColumns(
    'budgets',
    {
      education_id: {
        type: 'integer',
        notNull: false,
        references: 'education (id)',
        check: "(((action != 'education') and (education_id is null)) or"
             + " ((action  = 'education') and (education_id is not null)))",
        comment: 'link to education table when user is charged for education event',
      },
    },
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('budgets', 'budgets_check2');
  pgm.dropColumns('budgets', 'education_id');

  pgm.dropIndex('education', 'date');
  pgm.dropTable('education');

  pgm.dropIndex('edu_categories', 'category');
  pgm.dropTable('edu_categories');

  pgm.renameConstraint('budgets', 'budgets_hw_owner_history_id_fkey', 'hw_budgets_hw_owner_history_id_fkey');
  pgm.renameConstraint('budgets', 'budgets_hw_repairs_id_fkey', 'hw_budgets_hw_repairs_id_fkey');
  pgm.renameConstraint('budgets', 'budgets_user_id_fkey', 'hw_budgets_user_id_fkey');

  pgm.dropConstraint('budgets', 'budgets_check');
  pgm.addConstraint(
    'budgets',
    'hw_budgets_check',
    {
      check: "(((action = 'initial' or action = 'yearly' or action = 'correction' or action = 'hw_repair') and (hw_owner_history_id is null)) or"
           + " ((action = 'hw_buy' or action = 'hw_sell' or action = 'hw_repurchase') and (hw_owner_history_id is not null)))",
    },
  );
  pgm.dropConstraint('budgets', 'budgets_check1');
  pgm.addConstraint(
    'budgets',
    'hw_budgets_check1',
    {
      check: "(((action = 'initial' or action = 'yearly' or action = 'correction' or action = 'hw_buy' or action = 'hw_sell' or action = 'hw_repurchase') and (hw_repairs_id is null)) or"
           + " ((action = 'hw_repair') and (hw_repairs_id is not null)))",
    },
  );
  pgm.renameTable('budgets', 'hw_budgets');
};
