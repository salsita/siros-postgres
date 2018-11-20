import React from 'react';

export const Logout = (props) => {
  const { name, email, onClick } = props;
  return (
    <div>
      <div>
        <div>{name || 'not provided'}</div>
        <div>{email}</div>
      </div>
      <button type="button" onClick={onClick}>Logout</button>
    </div>
  );
};
