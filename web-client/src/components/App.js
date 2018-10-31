import React, { PureComponent } from 'react';
import { Header, Main } from './index';

import './App.css';

export class App extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Main />
      </React.Fragment>
    );
  }
}
