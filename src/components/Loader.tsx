import React from 'react';
import '../styles/Loader.css';

export const Loader = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className='loader'>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};
