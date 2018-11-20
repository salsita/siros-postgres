import React from 'react';
import { User } from './User';
import { version } from '../version';

export const Header = () => (
  <header>
    <div>
      <div>Siros</div>
      <div>version {version}</div>
    </div>
    <User />
  </header>
);
