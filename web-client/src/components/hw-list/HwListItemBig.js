import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { AlignedBlocks } from '../shared/AlignedBlocks';
import { LabelValuePairs } from '../utils';

const prepareHwData = (hwItem) => {
  const left = new LabelValuePairs();
  const right = new LabelValuePairs();

  left.push('category:', hwItem.category);
  if (hwItem.serial_id) { left.push('serial id:', hwItem.serial_id); }
  if (hwItem.active) {
    left.push('condition:', hwItem.condition);
    left.push('current price:', hwItem.current_price);
    left.push('on marketplace:', hwItem.available ? 'yes' : 'no');
  } else {
    left.push('active:', 'no');
  }

  right.push('purchase date:', hwItem.purchase_date);
  right.push('purchase price:', hwItem.purchase_price);
  right.push('purchased in:', hwItem.store);

  return { left, right };
};

export const HwListItemBig = (props) => {
  const { hwItem, cardClass } = props;
  const hwData = prepareHwData(hwItem);
  return (
    <Card className={cardClass}>
      <CardContent>
        <Typography className="hw-list-item-big-title">{hwItem.description}</Typography>
        <div className="hw-list-item-big-container">
          <div className="hw-list-item-big-box-left">
            <AlignedBlocks left={hwData.left.getLabels()} right={hwData.left.getValues()} />
          </div>
          <div className="hw-list-item-big-box-right">
            <AlignedBlocks left={hwData.right.getLabels()} right={hwData.right.getValues()} />
          </div>
        </div>
        {hwItem.comment && (
          <div className="hw-list-item-big-comment">
            <Typography component="span" className="hw-list-item-big-comment-text">{hwItem.comment}</Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
