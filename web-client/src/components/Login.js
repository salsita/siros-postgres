import React from 'react';

export const Login = (props) => {
  const { onClick } = props;
  let { reason } = props;
  if (reason === 'domain') { reason = 'Wrong domain account'; }
  return (
    <div>
      { reason && <div>{reason}</div> }
      <button type="button" onClick={onClick}>Login with Google</button>
    </div>
  );
};
