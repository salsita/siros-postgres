import React, { PureComponent } from 'react';

import { HwListItemSmallCollapsed } from './HwListItemSmallCollapsed';
import { HwListItemSmallExpanded } from './HwListItemSmallExpanded';

export class HwListItemSmall extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { collapsed: true };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const Variant = this.state.collapsed ? HwListItemSmallCollapsed : HwListItemSmallExpanded;
    const { hwItem, cardClass } = this.props;
    return <Variant hwItem={hwItem} cardClass={cardClass} onClick={this.onClick} />;
  }
}
