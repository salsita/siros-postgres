import React, { PureComponent } from 'react';

import { HwListItemSmallCollapsed } from './HwListItemSmallCollapsed';
import { HwListItemSmallExpanded } from './HwListItemSmallExpanded';

export class HwListItemSmall extends PureComponent {
  state = { collapsed: true }

  onClick = () => { this.setState({ collapsed: !this.state.collapsed }); }

  render() {
    const Variant = this.state.collapsed ? HwListItemSmallCollapsed : HwListItemSmallExpanded;
    const { hwItem, cardClass } = this.props;
    return <Variant hwItem={hwItem} cardClass={cardClass} onClick={this.onClick} />;
  }
}
