import React from 'react';

export const ErrorMessage = ({ message }: { message: string }) => {
  if (message.length === 0) {
    return null;
  } else {
    return <small className="ErrorMessage">{message}</small>;
  }
};
