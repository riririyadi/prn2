import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { FormIdContext } from '../../components/MainArea';
import {Modal} from '../../components/Modal';
import { User } from './Users';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

export default function LockUser({
  open,
  selectedRow,
  handleRefresh,
  close,
}: {
  open: boolean;
  selectedRow: User;
  handleRefresh: () => void;
  close: () => void;
}) {
  const formId = useContext(FormIdContext);
  const userData = localStorage.getItem('user_data');
  const persistedUserData = userData
    ? JSON.parse(userData)
    : {
        user_id: 0,
        user_description: '',
        company_id: 0,
        company_code: '',
        company_description: '',
        session: '',
      };

  const [user, setUser] = useState(persistedUserData);
  const [submittingLock, setSubmittingLock] = useState(false);
  const [outLockMessage, setOutLockMessage] = useState('');
  const [outStatus, setOutStatus] = useState(0);

  const handleUpdateLocked = () => {
    const functionName = selectedRow.locked
      ? 'UNLOCKED_ALLOWED'
      : 'LOCKED_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${selectedRow.user_id}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/onlocked`;
    setSubmittingLock(true);
    axios
      .post(
        url,
        {
          Validation: {
            timestamp,
            company_id: user.company_id,
            user_id: user.user_id,
            responsibility_id,
            group_function_id,
            form_id: formId,
            function_name: functionName,
            session: user.session,
            bu_id: 0,
          },
          Parameters: {
            User: {
              user_id: selectedRow.user_id,
              locked: selectedRow.locked ? false : true,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            apikey: apiKey,
            clientsignature: md5hash,
          },
        }
      )
      .then((response) => {
        setOutLockMessage(response.data.message);
        setOutStatus(response.data.status);
        if (response.data.status === 0) {
          handleRefresh();
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setSubmittingLock(false));
  };
  return (
    <Modal open={open} close={close}>
      <ConfirmationDialog
        caption={` Are you sure want to
              ${selectedRow.locked ? 'unlock' : 'lock'}
              ${selectedRow.user_name} ?`}
        submitState={submittingLock}
        outMessage={{ message: outLockMessage, status: outStatus }}
        handleYes={handleUpdateLocked}
        handleNo={close}
        handleClose={() => {
          close();
          setOutLockMessage('');
        }}
      />
    </Modal>
  );
}
