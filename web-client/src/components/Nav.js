import React, { PureComponent } from 'react';
import { Link } from 'react-router5';

import { routes } from '../router';

import './Nav.css';

export class Nav extends PureComponent {
  render() {
    return (
      <nav>
        {
          routes.filter((item) => (item.inMenu)).map((item) => (
            <Link key={item.name} routeName={item.name}>{item.menuText}</Link>
          ))
        }
      </nav>
    );
  }
}
