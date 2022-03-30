import React from 'react';
import { Loader } from './Loader';
import { MessageBox } from './MessageBox';

export default function ConfirmationDialog({
  caption,
  submitState,
  outMessage,
  handleYes,
  handleNo,
  handleClose,
}: {
  caption: string;
  submitState: boolean;
  outMessage: { message: string; status: number };
  handleYes: () => void;
  handleNo: () => void;
  handleClose: () => void;
}) {
  return (
    <div className='custom-modal'>
      {submitState ? (
        <Loader />
      ) : (
        <>
          {outMessage.message ? (
            <MessageBox
              message={{
                outMessage: outMessage.message,
                status: outMessage.status,
              }}
              close={handleClose}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <p>{caption}</p>
              <div style={{ marginTop: '10px' }}>
                <button className='secondary-btn' onClick={handleNo}>
                  No
                </button>
                <button className='primary-btn' onClick={handleYes}>
                  Yes
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
