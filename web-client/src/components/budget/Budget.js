import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import cx from 'classnames';

import { BudgetItemSmall } from './BudgetItemSmall';
import { BudgetItemBig } from './BudgetItemBig';
import './Budget.css';

const BudgetView = (props) => {
  const { error, items, total } = props.budget;
  if (!error && !items) { return null; }
  return (
    <>
      {items && (
        <div className="before-article">
          <Typography variant="h6">Your budget: {total}</Typography>
        </div>
      )}
      <article>
        {error && <Typography variant="h6" color="error">{error}!</Typography>}
        {items && items.map((item, idx) => {
          const { amount } = item;
          const cardClass = cx({
            'card-zero': amount === 0,
            'card-plus': amount > 0,
            'card-minus': amount < 0,
          });
          return (
            <React.Fragment key={idx}>
              <Hidden smUp>
                <BudgetItemSmall budgetItem={item} cardClass={cardClass} />
              </Hidden>
              <Hidden xsDown>
                <BudgetItemBig budgetItem={item} cardClass={cardClass} />
              </Hidden>
            </React.Fragment>
          );
        })}
      </article>
    </>
  );
};

const mapStateToProps = (state) => ({
  budget: state.budget,
});

export const Budget = connect(mapStateToProps)(BudgetView);
