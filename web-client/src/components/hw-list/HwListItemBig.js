import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { HwListItemBlock } from './HwListItemBlock';

export const HwListItemBig = (props) => {
  const { hwItem, cardClass } = props;
  const labelsLeft = ['category:'];
  const valuesLeft = [hwItem.category];
  if (hwItem.active) {
    labelsLeft.push('condition:');
    valuesLeft.push(hwItem.condition);
    labelsLeft.push('current price:');
    valuesLeft.push(hwItem.current_price);
    labelsLeft.push('on marketplace:');
    valuesLeft.push(hwItem.available ? 'yes' : 'no');
  } else {
    labelsLeft.push('active:');
    valuesLeft.push('no');
  }
  const labelsRight = ['purchase date:', 'purchase price:', 'purchased in:'];
  const valuesRight = [hwItem.purchase_date, hwItem.purchase_price, hwItem.store];
  return (
    <Card className={cardClass}>
      <CardContent className="hw-list-item-big">
        <Typography className="hw-list-item-big-title">{hwItem.description}</Typography>
        <div className="hw-list-item-big-container">
          <div className="hw-list-item-big-box-left">
            <div>
              <HwListItemBlock side="left" textColor="textSecondary">{labelsLeft}</HwListItemBlock>
              <HwListItemBlock side="right" textColor="textPrimary">{valuesLeft}</HwListItemBlock>
            </div>
          </div>
          <div className="hw-list-item-big-box-right">
            <div>
              <HwListItemBlock side="left" textColor="textSecondary">{labelsRight}</HwListItemBlock>
              <HwListItemBlock side="right" textColor="textPrimary">{valuesRight}</HwListItemBlock>
            </div>
          </div>
        </div>
        {hwItem.comment && (
          <div className="hw-list-item-big-comment">
            <Typography component="span" color="textSecondary">comment:</Typography>
            <Typography component="span" className="hw-list-item-big-comment-text">{hwItem.comment}</Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
