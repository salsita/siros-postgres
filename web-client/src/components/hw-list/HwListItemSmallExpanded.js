import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { HwListItemSmallPara } from './HwListItemSmallPara';

export const HwListItemSmallExpanded = (props) => {
  const { hwItem, cardClass, onClick } = props;
  return (
    <Card className={cardClass}>
      <CardContent className="hw-list-item-small-expanded">
        <HwListItemSmallPara header="category:" text={hwItem.category} />
        <HwListItemSmallPara header="description:" text={hwItem.description} />
        {!hwItem.active && <HwListItemSmallPara header="active:" text="no" />}
        {hwItem.active && <HwListItemSmallPara header="on marketplace:" text={hwItem.available ? 'yes' : 'no'} />}
        <HwListItemSmallPara header="purchase date:" text={hwItem.purchase_date} />
        <HwListItemSmallPara header="purchase price:" text={hwItem.purchase_price} />
        <HwListItemSmallPara header="purchased in:" text={hwItem.store} />
        <HwListItemSmallPara header="condition:" text={hwItem.condition} />
        {hwItem.active && <HwListItemSmallPara header="current price:" text={hwItem.current_price} />}
        {hwItem.comment && <HwListItemSmallPara header="comment:" text={hwItem.comment} />}
      </CardContent>
      <CardActions className="small-card-actions">
        <Button size="small" onClick={onClick}>Show less</Button>
      </CardActions>
    </Card>
  );
};
