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
        comment: 'we calculate hw budgets only for (active) real users',
      },
      active: {
        type: 'boolean',
        notNull: false,
        default: 'true',
        check: '((system is true) and (active is null)) or ((system is false) and (active is not null))',
        comment: 'we calculate hw budgets only for active (real) users',
      },
      email: {
        type: 'varchar(128)',
        notNull: false,
        unique: true,
        check: '((active is true) and (email is not null)) or ((active is not true) and (email is null))',
        comment: 'google mail that is used to auth the web user',
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
        comment: 'hw budget increases differ for part-time and full-time users',
      },
    },
    {
      comment: 'real and system users',
    },
  );
  // search by user name, get list of users ordered by name
  pgm.createIndex('users', 'name');
  // lookup user by email
  pgm.createIndex('users', 'email');
  // updating budgets only for users where (system = false) and (active = true)
  pgm.createIndex('users', ['system', 'active']);
};

exports.down = (pgm) => {
  pgm.dropIndex('users', 'name');
  pgm.dropIndex('users', 'email');
  pgm.dropIndex('users', ['system', 'active']);
  pgm.dropTable('users');
};
