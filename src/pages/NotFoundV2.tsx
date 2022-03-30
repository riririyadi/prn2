import React from 'react';

export default function NotFoundV2() {
  return (
    <div
      style={{
        height: 'calc(100vh - 50px)',
        width: '100%',
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
