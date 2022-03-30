import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { FormIdContext } from '../../components/MainArea';
import {Modal} from '../../components/Modal';
import { ThemeCtx } from '../Home';
import { User } from './Users';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

export default function ExpireUser({
  selectedRow,
  open,
  handleRefresh,
  close,
}: {
  selectedRow: User;
  open: boolean;
  handleRefresh: () => void;
  close: () => void;
}) {
  const formId = useContext(FormIdContext);
  const [submittingExpire, setSubmittingExpire] = useState(false);
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
  const [outExpireMessage, setOutExpireMessage] = useState('');
  const [outStatus, setOutStatus] = useState(0);

  const handleExpire = () => {
    const functionName = 'EXPIRED_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${selectedRow.user_id}${user.session}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/onexpired`;
    setSubmittingExpire(true);
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
        console.log(response.data);
        setOutExpireMessage(response.data.message);
        setOutStatus(response.data.status);
        if (response.data.status === 0) {
          handleRefresh();
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setSubmittingExpire(false));
  };

  return (
    <Modal open={open} close={close}>
      <ConfirmationDialog
        caption={`Are you sure want to expire ${selectedRow.user_name}?`}
        submitState={submittingExpire}
        outMessage={{ message: outExpireMessage, status: outStatus }}
        handleYes={handleExpire}
        handleNo={close}
        handleClose={() => {
          close();
          setOutExpireMessage('');
        }}
      />
    </Modal>
  );
}
