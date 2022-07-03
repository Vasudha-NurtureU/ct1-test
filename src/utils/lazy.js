import React from 'react'

function lazy(url, delay = '300') {
  return React.lazy(() => {
    return new Promise(resolve => {
      setTimeout(() => resolve(import(`components/${url}`)), delay);
    });
  });
}

export default lazy;
