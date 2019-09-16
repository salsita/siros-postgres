import React, { PureComponent } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { TitledParagraph } from '../shared/TitledParagraph';

const rx1 = /hw_repurchase/;
const rx2 = /hw_repair/;
const rx3 = /correction/;
const rx4 = /_/g;
const translateType = (str) => (
  str
    .replace(rx1, 'repurch.')
    .replace(rx2, 'repair')
    .replace(rx3, 'correct.')
    .replace(rx4, ' ')
);

export class BudgetItemSmall extends PureComponent {
  state = { collapsed: true }

  onClick = () => { this.setState({ collapsed: !this.state.collapsed }); }

  render() {
    const { budgetItem, cardClass } = this.props;
    const { collapsed } = this.state;
    return (
      <Card className={cardClass}>
        <CardContent className="budget-item-small">
          <div className="budget-item-small-header">
            <Typography className="budget-item-small-amount">{budgetItem.amountStr}</Typography>
            <Typography className="budget-item-small-type">{translateType(budgetItem.action)}</Typography>
            <Typography className="budget-item-small-date">{budgetItem.date}</Typography>
            <div className="budget-item-small-button">
              {(budgetItem.hw || budgetItem.education) && (
                <Button size="small" onClick={this.onClick}>{collapsed ? 'more' : 'less'}</Button>
              )}
            </div>
          </div>
          {!collapsed && budgetItem.hw && (
            <div className="budget-item-small-details">
              <TitledParagraph header="category:" text={budgetItem.hw.category} />
              <TitledParagraph header="description:" text={budgetItem.hw.description} />
              <TitledParagraph header="internal id:" text={budgetItem.hw.id} />
              {budgetItem.hw.serial_id && <TitledParagraph header="serial id:" text={budgetItem.hw.serial_id} />}
              {budgetItem.hw.condition && <TitledParagraph header="condition:" text={budgetItem.hw.condition} />}
              {(budgetItem.action === 'hw_buy') && budgetItem.hw.old_user
                && <TitledParagraph header="previous user:" text={budgetItem.hw.old_user} />}
              {(budgetItem.action !== 'hw_buy') && budgetItem.hw.new_user
                && <TitledParagraph header="new user:" text={budgetItem.hw.new_user} />}
              <TitledParagraph header="original purchase date:" text={budgetItem.hw.purchase_date} />
              <TitledParagraph header="original purchase price:" text={budgetItem.hw.purchase_price} />
              <TitledParagraph header="purchased in:" text={budgetItem.hw.store} />
              {budgetItem.hw.repair_description
                && <TitledParagraph header="repair description:" text={budgetItem.hw.repair_description} />}
            </div>
          )}
          {!collapsed && budgetItem.education && (
            <div className="budget-item-small-details">
              <TitledParagraph header="category:" text={budgetItem.education.category} />
              <TitledParagraph header="description:" text={budgetItem.education.description} />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}
