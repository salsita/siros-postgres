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
  // lookup id by store name
  pgm.createIndex('stores', 'store');

  pgm.createType(
    'type_hw_condition',
    ['new', 'used', 'broken', 'repaired', 'missing'],
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
  // search hw by category and store
  pgm.createIndex('hw', ['category', 'store']);
  // search hw by owner
  pgm.createIndex('hw', 'user_id');
  // marketplace: (active = true) and (available = true)
  pgm.createIndex('hw', ['active', 'available']);

  pgm.createTable(
    'hw_history',
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
      changed_field: {
        type: 'varchar(64)',
        notNull: true,
        comment: 'name of column in the hw table the value of which has changed',
      },
      old_value_str: {
        type: 'varchar(512)',
        notNull: true,
        comment: 'original value (stringified) before the change',
      },
      new_value_str: {
        type: 'varchar(512)',
        notNull: true,
        comment: 'updated value (stringified) after the change',
      },
      date: {
        type: 'date',
        notNull: true,
        default: pgm.func('now()::date'),
        comment: 'date of change, ISO 8601 format, YYYY-MM-DD',
      },
    },
    {
      comment: 'track of all changes in hw',
    },
  );
  // search history for given hw id
  pgm.createIndex('hw_history', 'hw_id');
};

exports.down = (pgm) => {
  pgm.dropIndex('hw_history', 'hw_id');
  pgm.dropTable('hw_history');

  pgm.dropIndex('hw', 'category');
  pgm.dropIndex('hw', 'store');
  pgm.dropIndex('hw', ['category', 'store']);
  pgm.dropIndex('hw', 'user_id');
  pgm.dropIndex('hw', ['active', 'available']);
  pgm.dropTable('hw');
  pgm.dropType('type_hw_condition');

  pgm.dropIndex('stores', 'store');
  pgm.dropTable('stores');

  pgm.dropTable('hw_categories');
};
