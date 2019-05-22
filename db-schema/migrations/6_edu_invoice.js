exports.up = (pgm) => {
  pgm.addColumns(
    'education',
    {
      invoice_id: {
        type: 'varchar(64)',
        notNull: false,
        comment: 'id (string) of the invoice from the education provider',
      },

    },
  );
};

exports.down = (pgm) => {
  pgm.dropColumns('education', 'invoice_id');
};
