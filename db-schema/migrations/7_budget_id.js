exports.up = (pgm) => {
  pgm.addColumns(
    'budgets',
    {
      id: {
        type: 'serial',
        primaryKey: true,
      },
      created: {
        type: 'timestamp',
        default: pgm.func('CURRENT_TIMESTAMP'),
      },
    },
  );
};
