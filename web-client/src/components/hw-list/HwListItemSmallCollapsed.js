import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { HwListItemBlock } from './HwListItemBlock';

export const HwListItemSmallCollapsed = (props) => {
  const { hwItem, cardClass, onClick } = props;
  const labels = ['category:', 'description:'];
  const values = [hwItem.category, hwItem.description];
  if (hwItem.active) {
    labels.push('current price:');
    values.push(hwItem.current_price);
  }
  return (
    <Card className={cardClass}>
      <CardContent className="hw-list-item-small-collapsed">
        <HwListItemBlock side="left" textColor="textSecondary">{labels}</HwListItemBlock>
        <HwListItemBlock side="right" textColor="textPrimary">{values}</HwListItemBlock>
      </CardContent>
      <CardActions className="small-card-actions">
        <Button size="small" onClick={onClick}>Show more</Button>
      </CardActions>
    </Card>
  );
};
