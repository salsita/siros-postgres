exports.up = (pgm) => {
  pgm.createTable(
    'users',
    {
      id: {
        type: 'serial',
        unique: true,
        primaryKey: true,
        notNull: true,
        comment: 'auto-incremented id',
      },
      name: {
        type: 'varchar(128)',
        notNull: true,
        comment: 'name of the (system / real) user',
      },
      system: {
        type: 'boolean',
        notNull: true,
        default: 'false',
        comment: 'we calculate HW budgets only for (active) real users',
      },
      active: {
        type: 'boolean',
        notNull: false,
        default: 'true',
        check: '((system is true) and (active is null)) or ((system is false) and (active is not null))',
        comment: 'we calculate HW budgets only for active (real) users',
      },
      start_date: {
        type: 'date',
        notNull: false,
        default: pgm.func('now()::date'),
        check: '((system is true) and (start_date is null)) or ((system is false) and (start_date is not null))',
        comment: 'ISO 8601 format, YYYY-MM-DD',
      },
      part_time: {
        type: 'boolean',
        notNull: false,
        default: 'false',
        check: '((system is true) and (part_time is null)) or ((system is false) and (part_time is not null))',
        comment: 'HW budget increases differ for part-time and full-time users',
      },
    },
    {
      comment: 'real and system users',
    },
  );
  pgm.createIndex('users', 'name');
  pgm.createIndex('users', 'system');
  pgm.createIndex('users', 'active');
};

exports.down = (pgm) => {
  pgm.dropIndex('users', 'name');
  pgm.dropIndex('users', 'system');
  pgm.dropIndex('users', 'active');
  pgm.dropTable('users');
};
