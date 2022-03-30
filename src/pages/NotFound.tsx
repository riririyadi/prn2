import React from 'react';

export default function NotFound() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100wh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h5>404.</h5>
      <p>The page you looking for is not found.</p>
    </div>
  );
}
