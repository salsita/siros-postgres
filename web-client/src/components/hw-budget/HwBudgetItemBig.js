import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { AlignedBlocks } from '../shared/AlignedBlocks';

const rx = /_/g;
const translateType = (str) => (str.replace(rx, ' '));

export const HwBudgetItemBig = (props) => {
  const { budgetItem, cardClass } = props;
  const labelsLeft = [];
  const valuesLeft = [];
  const labelsRight = [];
  const valuesRight = [];
  if (budgetItem.hw) {
    const { hw } = budgetItem;
    labelsLeft.push('category:');
    valuesLeft.push(hw.category);
    if (hw.serial_id) {
      labelsLeft.push('serial id:');
      valuesLeft.push(hw.serial_id);
    }
    if (hw.condition) {
      labelsLeft.push('condition:');
      valuesLeft.push(hw.condition);
    }
    if ((budgetItem.action === 'hw_buy') && hw.old_user) {
      labelsLeft.push('previous user:');
      valuesLeft.push(hw.old_user);
    }
    if ((budgetItem.action !== 'hw_buy') && hw.new_user) {
      labelsLeft.push('new user:');
      valuesLeft.push(hw.new_user);
    }
    if (hw.repair_description) {
      labelsLeft.push('repair descr.:');
      valuesLeft.push(hw.repair_description);
    }
    labelsRight.push('original purchase date:', 'original purchase price:', 'purchased in:');
    valuesRight.push(hw.purchase_date, hw.purchase_price, hw.store);
  }
  return (
    <Card className={cardClass}>
      <CardContent>
        <div className="hw-budget-item-big-header">
          <Typography className="hw-budget-item-big-amount">{budgetItem.amountStr}</Typography>
          <Typography className="hw-budget-item-big-type">{translateType(budgetItem.action)}</Typography>
          <Typography className="hw-budget-item-big-date">{budgetItem.date}</Typography>
        </div>
        {budgetItem.hw && (
          <React.Fragment>
            <Typography className="hw-budget-item-big-title">{budgetItem.hw.description}</Typography>
            <div className="hw-budget-item-big-container">
              <div className="hw-budget-item-big-box-left">
                <AlignedBlocks left={labelsLeft} right={valuesLeft} />
              </div>
              <div className="hw-budget-item-big-box-right">
                <AlignedBlocks left={labelsRight} right={valuesRight} />
              </div>
            </div>
          </React.Fragment>
        )}
      </CardContent>
    </Card>
  );
};
