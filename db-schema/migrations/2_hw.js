exports.up = (pgm) => {
  pgm.createTable(
    'hw_categories',
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
      comment: 'hw categories (monitor, laptop, ...)',
    },
  );
  // lookup id or sort by category name
  pgm.createIndex('hw_categories', 'category');

  pgm.createTable(
    'stores',
    {
      id: {
        type: 'serial',
        unique: true,
        primaryKey: true,
        notNull: true,
        comment: 'auto-incremented id',
      },
      store: {
        type: 'varchar(128)',
        unique: true,
        notNull: true,
        comment: 'actual name of the store',
      },
    },
    {
      comment: 'store names (alza, smarty, ...)',
    },
  );
  // lookup id or store by store name
  pgm.createIndex('stores', 'store');

  pgm.createType(
    'type_hw_condition',
    ['new', 'used', 'broken', 'repaired', 'missing', 'discarded'],
  );
  pgm.createTable(
    'hw',
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
        references: 'hw_categories (id)',
        comment: 'hw category',
      },
      description: {
        type: 'varchar(512)',
        notNull: false,
        comment: 'hw description (model, resolution, size, ...)',
      },
      store: {
        type: 'integer',
        notNull: true,
        references: 'stores (id)',
        comment: 'where was this hw bought',
      },
      purchase_date: {
        type: 'date',
        notNull: true,
        default: pgm.func('now()::date'),
        comment: 'ISO 8601 format, YYYY-MM-DD',
      },
      purchase_price: {
        type: 'integer',
        notNull: true,
        comment: 'what was the original cost',
      },
      store_invoice_id: {
        type: 'varchar(64)',
        notNull: false,
        comment: 'id (string) of the invoice from the store',
      },
      serial_id: {
        type: 'varchar(64)',
        notNull: false,
        comment: 'manufacturer serial id (string)',
      },
      condition: {
        type: 'type_hw_condition',
        notNull: true,
        comment: 'current hw condition',
      },
      user_id: {
        type: 'integer',
        notNull: true,
        references: 'users (id)',
        comment: 'current user',
      },
      inventory_id: {
        type: 'varchar(64)',
        notNull: false,
        comment: 'local inventory id (string), written on the label that is stuck on the back of the hw piece',
      },
      max_price: {
        type: 'integer',
        notNull: false,
        comment: 'if set, selling price for the hw will be minimum of this value and aging price (given by formula)',
      },
      active: {
        type: 'boolean',
        notNull: true,
        default: true,
        comment: 'if false, the hw is sold outside Salsita',
      },
      available: {
        type: 'boolean',
        notNull: true,
        default: false,
        comment: 'if true, the hw is available for taking',
      },
      comment: {
        type: 'varchar(512)',
        notNull: false,
        comment: 'additional information',
      },
    },
    {
      comment: 'managed hw',
    },
  );
  // search hw by category
  pgm.createIndex('hw', 'category');
  // search hw by store
  pgm.createIndex('hw', 'store');
  // search hw by owner
  pgm.createIndex('hw', 'user_id');
  // marketplace: (active = true) and (available = true)
  pgm.createIndex('hw', ['active', 'available']);

  pgm.createTable(
    'hw_owner_history',
    {
      id: {
        type: 'serial',
        unique: true,
        primaryKey: true,
        notNull: true,
        comment: 'auto-incremented id',
      },
      hw_id: {
        type: 'integer',
        notNull: true,
        references: 'hw (id)',
        comment: 'what hw is this history info for',
      },
      old_user_id: {
        type: 'integer',
        notNull: true,
        references: 'users (id)',
        comment: 'original user',
      },
      new_user_id: {
        type: 'integer',
        notNull: true,
        references: 'users (id)',
        comment: 'new user',
      },
      amount: {
        type: 'integer',
        notNull: true,
        comment: 'budget amount spent on changing the owner',
      },
      date: {
        type: 'date',
        notNull: true,
        default: pgm.func('now()::date'),
        comment: 'date of change, ISO 8601 format, YYYY-MM-DD',
      },
      condition: {
        type: 'type_hw_condition',
        notNull: true,
        comment: 'hw condition when changing the owner',
      },
    },
    {
      comment: 'track of all owner changes',
    },
  );
  // search history for given hw id
  pgm.createIndex('hw_owner_history', 'hw_id');

  pgm.createTable(
    'hw_repairs',
    {
      id: {
        type: 'serial',
        unique: true,
        primaryKey: true,
        notNull: true,
        comment: 'auto-incremented id',
      },
      hw_id: {
        type: 'integer',
        notNull: true,
        references: 'hw (id)',
        comment: 'what hw has been repaired',
      },
      user_id: {
        type: 'integer',
        notNull: true,
        references: 'users (id)',
        comment: 'user charged for this repair',
      },
      amount: {
        type: 'integer',
        notNull: true,
        comment: 'cost of the repair',
      },
      date: {
        type: 'date',
        notNull: true,
        default: pgm.func('now()::date'),
        comment: 'date of change, ISO 8601 format, YYYY-MM-DD',
      },
      description: {
        type: 'varchar(512)',
        notNull: true,
        comment: 'description of the repair',
      },
    },
    {
      comment: 'track of all hw repairs',
    },
  );
  // search repairs for given hw id
  pgm.createIndex('hw_repairs', 'hw_id');
};

exports.down = (pgm) => {
  pgm.dropIndex('hw_repairs', 'hw_id');
  pgm.dropTable('hw_repairs');

  pgm.dropIndex('hw_owner_history', 'hw_id');
  pgm.dropTable('hw_owner_history');

  pgm.dropIndex('hw', 'category');
  pgm.dropIndex('hw', 'store');
  pgm.dropIndex('hw', 'user_id');
  pgm.dropIndex('hw', ['active', 'available']);
  pgm.dropTable('hw');
  pgm.dropType('type_hw_condition');

  pgm.dropIndex('stores', 'store');
  pgm.dropTable('stores');

  pgm.dropIndex('hw_categories', 'category');
  pgm.dropTable('hw_categories');
};
