import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { AlignedBlocks } from '../shared/AlignedBlocks';

export const MarketplaceItemBig = (props) => {
  const { hwItem } = props;
  const labelsLeft = ['category:'];
  const valuesLeft = [hwItem.category];
  if (hwItem.serial_id) {
    labelsLeft.push('serial id:');
    valuesLeft.push(hwItem.serial_id);
  }
  labelsLeft.push('condition:');
  valuesLeft.push(hwItem.condition);
  labelsLeft.push('current owner:');
  valuesLeft.push(hwItem.owner);
  labelsLeft.push('current price:');
  valuesLeft.push(hwItem.current_price);
  const labelsRight = ['purchase date:', 'purchase price:', 'purchased in:'];
  const valuesRight = [hwItem.purchase_date, hwItem.purchase_price, hwItem.store];
  return (
    <Card>
      <CardContent>
        <Typography className="marketplace-item-big-title">{hwItem.description}</Typography>
        <div className="marketplace-item-big-container">
          <div className="marketplace-item-big-box-left">
            <AlignedBlocks left={labelsLeft} right={valuesLeft} />
          </div>
          <div className="marketplace-item-big-box-right">
            <AlignedBlocks left={labelsRight} right={valuesRight} />
          </div>
        </div>
        {hwItem.comment && (
          <div className="marketplace-item-big-comment">
            <Typography component="span" className="marketplace-item-big-comment-text">{hwItem.comment}</Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
