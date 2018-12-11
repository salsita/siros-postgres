import React, { PureComponent } from 'react';

import { MarketplaceItemSmallCollapsed } from './MarketplaceItemSmallCollapsed';
import { MarketplaceItemSmallExpanded } from './MarketplaceItemSmallExpanded';

export class MarketplaceItemSmall extends PureComponent {
  state = { collapsed: true }

  onClick = () => { this.setState({ collapsed: !this.state.collapsed }); }

  render() {
    const Variant = this.state.collapsed ? MarketplaceItemSmallCollapsed : MarketplaceItemSmallExpanded;
    const { hwItem } = this.props;
    return <Variant hwItem={hwItem} onClick={this.onClick} />;
  }
}
