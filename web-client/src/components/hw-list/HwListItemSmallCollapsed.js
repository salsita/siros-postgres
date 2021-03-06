import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { AlignedBlocks } from '../shared/AlignedBlocks';
import { LabelValuePairs } from '../utils';

const prepareHwData = (hwItem) => {
  const data = new LabelValuePairs();
  data.push('category:', hwItem.category);
  data.push('description:', hwItem.description);
  if (hwItem.active) { data.push('current price:', hwItem.current_price); }
  return data;
};

export const HwListItemSmallCollapsed = (props) => {
  const { hwItem, cardClass, onClick } = props;
  const hwData = prepareHwData(hwItem);
  return (
    <Card className={cardClass}>
      <CardContent>
        <AlignedBlocks left={hwData.getLabels()} right={hwData.getValues()} />
      </CardContent>
      <CardActions className="small-card-actions">
        <Button size="small" onClick={onClick}>Show more</Button>
      </CardActions>
    </Card>
  );
};
