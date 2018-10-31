import React, { PureComponent } from 'react';
import { User } from './index';
import { version } from '../version';

export class Header extends PureComponent {
  render() {
    return (
      <header>
        <div>
          <div>Siros</div>
          <div>version {version}</div>
        </div>
        <User />
      </header>
    );
  }
}
