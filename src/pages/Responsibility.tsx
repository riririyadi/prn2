import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContentPageDummy from '../components/ContentPageDummy';
import { FormIdContext } from '../components/MainArea';

export default function Responsibility() {
  const formId = React.useContext(FormIdContext);

  return (
    <div
      style={{
        height: '500px',
        width: '100%',
        backgroundColor: 'white',
      }}
    >
      <h3 style={{ paddingTop: '20px', marginLeft: '20px' }}>Responsibility</h3>

      <ContentPageDummy />
    </div>
  );
}
