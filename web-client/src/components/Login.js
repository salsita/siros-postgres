import React, { PureComponent } from 'react';

export class Login extends PureComponent {
  render() {
    const { onClick } = this.props;
    let { reason } = this.props;
    if (reason === 'domain') { reason = 'Wrong domain account'; }
    return (
      <div>
        { reason && <div>{reason}</div> }
        <button type='button' onClick={onClick}>Login with Google</button>
      </div>
    );
  }
}
