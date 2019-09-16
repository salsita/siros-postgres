import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { AlignedBlocks } from '../shared/AlignedBlocks';
import { LabelValuePairs } from '../utils';

const rx = /_/g;
const translateType = (str) => (str.replace(rx, ' '));

const prepareHwData = (budgetItem) => {
  const left = new LabelValuePairs();
  const right = new LabelValuePairs();

  if (!budgetItem.hw) { return { left, right }; }
  const { hw } = budgetItem;

  left.push('category:', hw.category);
  left.push('internal id:', hw.id);
  if (hw.serial_id) { left.push('serial id:', hw.serial_id); }
  if (hw.condition) { left.push('condition:', hw.condition); }
  if ((budgetItem.action === 'hw_buy') && hw.old_user) { left.push('previous user:', hw.old_user); }
  if ((budgetItem.action !== 'hw_buy') && hw.new_user) { left.push('new user:', hw.new_user); }
  if (hw.repair_description) { left.push('repair descr.:', hw.repair_description); }

  right.push('original purchase date:', hw.purchase_date);
  right.push('original purchase price:', hw.purchase_price);
  right.push('purchased in:', hw.store);

  return { left, right };
};

const prepareEduData = (budgetItem) => {
  const result = new LabelValuePairs();

  if (!budgetItem.education) { return result; }
  const { education } = budgetItem;

  result.push('category:', education.category);
  result.push('description:', education.description);

  return result;
};

export const BudgetItemBig = (props) => {
  const { budgetItem, cardClass } = props;
  const hwData = prepareHwData(budgetItem);
  const eduData = prepareEduData(budgetItem);
  return (
    <Card className={cardClass}>
      <CardContent>
        <div className="budget-item-big-header">
          <Typography className="budget-item-big-amount">{budgetItem.amountStr}</Typography>
          <Typography className="budget-item-big-type">{translateType(budgetItem.action)}</Typography>
          <Typography className="budget-item-big-date">{budgetItem.date}</Typography>
        </div>
        {budgetItem.hw && (
          <>
            <Typography className="budget-item-big-title">{budgetItem.hw.description}</Typography>
            <div className="budget-item-big-container">
              <div className="budget-item-big-box-left">
                <AlignedBlocks left={hwData.left.getLabels()} right={hwData.left.getValues()} />
              </div>
              <div className="budget-item-big-box-right">
                <AlignedBlocks left={hwData.right.getLabels()} right={hwData.right.getValues()} />
              </div>
            </div>
          </>
        )}
        {budgetItem.education && (
          <div className="budget-item-big-container">
            <AlignedBlocks left={eduData.getLabels()} right={eduData.getValues()} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
