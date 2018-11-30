import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { AlignedBlocks } from '../shared/AlignedBlocks';

export const MarketplaceItemSmallCollapsed = (props) => {
  const { hwItem, onClick } = props;
  const labels = ['category:', 'description:', 'current price:'];
  const values = [hwItem.category, hwItem.description, hwItem.current_price];
  return (
    <Card>
      <CardContent>
        <AlignedBlocks left={labels} right={values} />
      </CardContent>
      <CardActions className="small-card-actions">
        <Button size="small" onClick={onClick}>Show more</Button>
      </CardActions>
    </Card>
  );
};
