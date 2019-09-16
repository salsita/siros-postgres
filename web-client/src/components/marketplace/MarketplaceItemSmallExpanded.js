import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { TitledParagraph } from '../shared/TitledParagraph';

export const MarketplaceItemSmallExpanded = (props) => {
  const { hwItem, onClick } = props;
  return (
    <Card>
      <CardContent>
        <TitledParagraph header="category:" text={hwItem.category} />
        <TitledParagraph header="description:" text={hwItem.description} />
        <TitledParagraph header="internal id:" text={hwItem.id} />
        {hwItem.serial_id && <TitledParagraph header="serial id:" text={hwItem.serial_id} />}
        <TitledParagraph header="purchase date:" text={hwItem.purchase_date} />
        <TitledParagraph header="purchase price:" text={hwItem.purchase_price} />
        <TitledParagraph header="purchased in:" text={hwItem.store} />
        <TitledParagraph header="condition:" text={hwItem.condition} />
        <TitledParagraph header="current owner:" text={hwItem.owner} />
        <TitledParagraph header="current price:" text={hwItem.current_price} />
        {hwItem.comment && <TitledParagraph header="comment:" text={hwItem.comment} />}
      </CardContent>
      <CardActions className="small-card-actions">
        <Button size="small" onClick={onClick}>Show less</Button>
      </CardActions>
    </Card>
  );
};
