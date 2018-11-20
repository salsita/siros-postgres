import React from 'react';
import { Link } from 'react-router5';

import { routes } from '../router/routes';
import './Nav.css';

export const Nav = () => (
  <nav>
    {
      routes.filter((item) => (item.inMenu)).map((item) => (
        <Link key={item.name} routeName={item.name}>{item.menuText}</Link>
      ))
    }
  </nav>
);
