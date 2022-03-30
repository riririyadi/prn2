import React from 'react';
import { CgCloseO } from 'react-icons/cg';
import { FiCheckCircle } from 'react-icons/fi';
import { TiWarningOutline } from 'react-icons/ti';
import {Modal} from './Modal';

export const MessageBox = ({
  message,
  close,
}: {
  message: {
    outMessage: string;
    status: number;
  };
  close: () => void;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {message.status === 0 ? (
            <FiCheckCircle color='green' size={40} />
          ) : (
            <TiWarningOutline color='red' size={40} />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <p>{message.outMessage}</p>
        </div>
      </div>
      <div style={{ marginTop: '30px' }}>
        <button onClick={close}>Close</button>
      </div>
    </div>
  );
};
