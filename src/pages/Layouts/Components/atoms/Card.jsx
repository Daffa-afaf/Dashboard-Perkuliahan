import React from 'react';

const Card = ({ children, className = "" }) => {
  return (
    <div className={`w-full bg-white p-8 shadow-lg rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;
