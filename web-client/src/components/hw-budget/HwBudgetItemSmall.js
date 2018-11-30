import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { TitledParagraph } from '../shared/TitledParagraph';

const rx1 = /hw_repurchase/;
const rx2 = /hw_repair/;
const rx3 = /correction/;
const rx4 = /_/g;
const translateType = (str) => (
  str
    .replace(rx1, 'repurch.')
    .replace(rx2, 'repair')
    .replace(rx3, 'correct.')
    .replace(rx4, ' ')
);

export const HwBudgetItemSmall = (props) => {
  const { budgetItem, cardClass, onClick } = props;
  return (
    <Card className={cardClass}>
      <CardContent className="hw-budget-item-small">
        <div className="hw-budget-item-small-header">
          <Typography className="hw-budget-item-small-amount">{budgetItem.amountStr}</Typography>
          <Typography className="hw-budget-item-small-type">{translateType(budgetItem.action)}</Typography>
          <Typography className="hw-budget-item-small-date">{budgetItem.date}</Typography>
          <div className="hw-budget-item-small-button">
            {budgetItem.hw && (<Button size="small" onClick={onClick}>
               {budgetItem.collapsed ? 'more' : 'less'}
             </Button>)}
          </div>
        </div>
        {!budgetItem.collapsed && (
          <div className="hw-budget-item-small-details">
            <TitledParagraph header="category:" text={budgetItem.hw.category} />
            <TitledParagraph header="description:" text={budgetItem.hw.description} />
            {budgetItem.hw.serial_id && <TitledParagraph header="serial id:" text={budgetItem.hw.serial_id} />}
            <TitledParagraph header="condition:" text={budgetItem.hw.condition} />
            <TitledParagraph header="previous user:" text={budgetItem.hw.old_user} />
            <TitledParagraph header="original purchase date:" text={budgetItem.hw.purchase_date} />
            <TitledParagraph header="oroginal purchase price:" text={budgetItem.hw.purchase_price} />
            <TitledParagraph header="purchased in:" text={budgetItem.hw.store} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
