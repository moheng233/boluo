import React from 'react';

interface Props {
  message: string;
}

export const FormError: React.FC<Props> = ({ message }) => {
  if (message.length === 0) {
    return null;
  } else {
    return <div className="ErrorMessage">{message}</div>;
  }
};
