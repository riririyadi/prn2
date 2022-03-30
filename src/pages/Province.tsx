import React from 'react';
import { useParams } from 'react-router-dom';
import ContentPageDummy from '../components/ContentPageDummy';

export default function Province() {
  let { id } = useParams();
  return (
    <div style={{ height: '500px', width: '100%', backgroundColor: 'white' }}>
      <h3 style={{ paddingTop: '20px', marginLeft: '20px' }}>Province</h3>
      <ContentPageDummy />
    </div>
  );
}
