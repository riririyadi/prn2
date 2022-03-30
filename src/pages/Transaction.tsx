import React from 'react';
import ContentPageDummy from '../components/ContentPageDummy';

export default function Transaction() {
  return (
    <div
      style={{
        height: '500px',
        width: '100%',
        backgroundColor: 'white',
      }}
    >
      <h3 style={{ paddingTop: '20px', marginLeft: '20px' }}>Transaction</h3>
      <ContentPageDummy />
    </div>
  );
}
