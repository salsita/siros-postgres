import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { HwListItemSmallBlock } from './HwListItemSmallBlock';

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
        <HwListItemSmallBlock align="right" textColor="textSecondary">{labels}</HwListItemSmallBlock>
        <HwListItemSmallBlock align="left" textColor="textPrimary">{values}</HwListItemSmallBlock>
      </CardContent>
      <CardActions className="small-card-actions">
        <Button size="small" onClick={onClick}>Show more</Button>
      </CardActions>
    </Card>
  );
};
