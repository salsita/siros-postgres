import React, { PureComponent } from 'react';

export class Logout extends PureComponent {
  render() {
    const { name, email, onClick } = this.props;
    return (
      <div>
        <div>
          <div>{name || 'not provided'}</div>
          <div>{email}</div>
        </div>
        <button type='button' onClick={onClick}>Logout</button>
      </div>
    );
  }
}
