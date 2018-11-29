import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { TitledParagraph } from '../shared/TitledParagraph';

const rx1 = /_/g;
const rx2 = /repurchase/;
const translateCategory = (str) => (str.replace(rx1, ' ').replace(rx2, 'rep.'));

export const HwBudgetItemSmall = (props) => {
  const { hwItem, cardClass, onClick } = props;
  return (
    <Card className={cardClass}>
      <CardContent className="hw-budget-item-small">
        <div className="hw-budget-item-small-header">
          <Typography className="hw-budget-item-small-amount">{hwItem.amountStr}</Typography>
          <Typography className="hw-budget-item-small-category">{translateCategory(hwItem.action)}</Typography>
          <Typography className="hw-budget-item-small-date">{hwItem.date}</Typography>
          <div className="hw-budget-item-small-button">
            {hwItem.hw && (<Button size="small" onClick={onClick}>
               {hwItem.collapsed ? 'more' : 'less'}
             </Button>)}
          </div>
        </div>
        {!hwItem.collapsed && (
          <div className="hw-budget-item-small-details">
            <TitledParagraph header="category:" text={hwItem.hw.category} />
            <TitledParagraph header="description:" text={hwItem.hw.description} />
            {hwItem.hw.serial_id && <TitledParagraph header="serial id:" text={hwItem.hw.serial_id} />}
            <TitledParagraph header={`condition (on ${hwItem.date}):`} text={hwItem.hw.condition} />
            <TitledParagraph header="previous user:" text={hwItem.hw.old_user} />
            <TitledParagraph header="original purchase date:" text={hwItem.hw.purchase_date} />
            <TitledParagraph header="original purchase price:" text={hwItem.hw.purchase_price} />
            <TitledParagraph header="purchased in:" text={hwItem.hw.store} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
