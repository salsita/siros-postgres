import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { HwListItemPara } from './HwListItemPara';

export const HwListItemSmallExpanded = (props) => {
  const { hwItem, cardClass, onClick } = props;
  return (
    <Card className={cardClass}>
      <CardContent className="hw-list-item-small-expanded">
        <HwListItemPara header="category:" text={hwItem.category} />
        <HwListItemPara header="description:" text={hwItem.description} />
        {hwItem.serial_id && <HwListItemPara header="serial id:" text={hwItem.serial_id} />}
        {!hwItem.active && <HwListItemPara header="active:" text="no" />}
        {hwItem.active && <HwListItemPara header="on marketplace:" text={hwItem.available ? 'yes' : 'no'} />}
        <HwListItemPara header="purchase date:" text={hwItem.purchase_date} />
        <HwListItemPara header="purchase price:" text={hwItem.purchase_price} />
        <HwListItemPara header="purchased in:" text={hwItem.store} />
        <HwListItemPara header="condition:" text={hwItem.condition} />
        {hwItem.active && <HwListItemPara header="current price:" text={hwItem.current_price} />}
        {hwItem.comment && <HwListItemPara header="comment:" text={hwItem.comment} />}
      </CardContent>
      <CardActions className="small-card-actions">
        <Button size="small" onClick={onClick}>Show less</Button>
      </CardActions>
    </Card>
  );
};
