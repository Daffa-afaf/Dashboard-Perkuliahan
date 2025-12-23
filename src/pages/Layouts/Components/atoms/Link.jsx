import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Link = ({ href = "#", children, className = "", ...props }) => {
  // If href starts with http(s) keep external anchor, otherwise use react-router Link
  const isExternal = /^https?:\/\//.test(href) || href.startsWith('mailto:');

  if (isExternal) {
    return (
      <a href={href} className={`text-blue-500 hover:underline ${className}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} className={`text-blue-500 hover:underline ${className}`} {...props}>
      {children}
    </RouterLink>
  );
};

export default Link;
