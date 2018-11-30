import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { AlignedBlocks } from '../shared/AlignedBlocks';

export const HwListItemBig = (props) => {
  const { hwItem, cardClass } = props;
  const labelsLeft = ['category:'];
  const valuesLeft = [hwItem.category];
  if (hwItem.serial_id) {
    labelsLeft.push('serial id:');
    valuesLeft.push(hwItem.serial_id);
  }
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
      <CardContent>
        <Typography className="hw-list-item-big-title">{hwItem.description}</Typography>
        <div className="hw-list-item-big-container">
          <div className="hw-list-item-big-box-left">
            <AlignedBlocks left={labelsLeft} right={valuesLeft} />
          </div>
          <div className="hw-list-item-big-box-right">
            <AlignedBlocks left={labelsRight} right={valuesRight} />
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
