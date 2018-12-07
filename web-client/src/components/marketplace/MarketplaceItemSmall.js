import React, { PureComponent } from 'react';

import { MarketplaceItemSmallCollapsed } from './MarketplaceItemSmallCollapsed';
import { MarketplaceItemSmallExpanded } from './MarketplaceItemSmallExpanded';

export class MarketplaceItemSmall extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { collapsed: true };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const Variant = this.state.collapsed ? MarketplaceItemSmallCollapsed : MarketplaceItemSmallExpanded;
    const { hwItem } = this.props;
    return <Variant hwItem={hwItem} onClick={this.onClick} />;
  }
}
