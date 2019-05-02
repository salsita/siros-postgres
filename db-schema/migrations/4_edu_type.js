exports.up = (pgm) => {
  pgm.noTransaction();
  pgm.addTypeValue(
    'type_budget_action',
    'education',
    { ifNotExists: true },
  ); // no "down" counter-operation --> ifNotExists
};

exports.down = () => {
};
