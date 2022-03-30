import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { FormIdContext } from '../../components/MainArea';
import {Modal} from '../../components/Modal';
import { User } from './Users';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

export default function ChangeUserPassword({
  selectedRow,
  open,
  close,
  handleRefresh,
}: {
  open: boolean;
  selectedRow: User;
  close: () => void;
  handleRefresh: () => void;
}) {
  const formId = useContext(FormIdContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
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

  const handleChangePassword = () => {
    const functionName = 'CHANGE_PASSWORD_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${selectedRow.user_id}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/onchangepwd`;
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
              user_password: newPassword,
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
        if (response.data.status === 0) {
          handleRefresh();
        }
      })
      .catch((err) => console.log(err));
    setNewPassword('');
    setConfirmNewPassword('');
  };
  return (
    <Modal open={open} close={close}>
      <div className='custom-modal'>
        <p>Change password for {selectedRow.user_name}</p>
        <div>
          <label>New Password</label>
          <br />
          <input
            type='password'
            name='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <br />
          <input
            type='password'
            name='confirm'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <button className='secondary-btn' onClick={close}>
            Close
          </button>
          <button
            className='primary-btn'
            onClick={handleChangePassword}
            disabled={
              !newPassword ||
              !confirmNewPassword ||
              newPassword !== confirmNewPassword
            }
          >
            Change Password
          </button>
        </div>
      </div>
    </Modal>
  );
}
