import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import React, { useState } from 'react';
import { FormIdContext } from '../../components/MainArea';
import {Modal} from '../../components/Modal';
import { User } from './Users';
import { MdClose } from 'react-icons/md';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

export default function EditUser({
  selectedRowData,
  handleChange,
  open,
  close,
  handleRefresh,
  setOutId,
}: {
  selectedRowData: User;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  open: boolean;
  close: () => void;
  handleRefresh: () => void;
  setOutId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const formId = React.useContext(FormIdContext);
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

  const [openYesNo, setOpenYesNo] = useState(false);
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [outMessage, setOutMessage] = useState('');
  const [outStatus, setOutStatus] = useState(0);

  const handleAdd = () => {
    console.log('handleAdd');
    const functionName = 'INSERT_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/users/oninsert`;
    setSubmittingAdd(true);
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
              company_id: user.company_id,
              user_name: selectedRowData.user_name,
              user_description: selectedRowData.user_description,
              email: selectedRowData.email,
              phone_number: selectedRowData.phone_number,
              start_effective_date: selectedRowData.start_effective_date
                ? moment(selectedRowData.start_effective_date).format(
                    'DD-MM-YYYY HH:mm:ss'
                  )
                : '',
              end_effective_date: selectedRowData.end_effective_date
                ? moment(selectedRowData.end_effective_date).format(
                    'DD-MM-YYYY HH:mm:ss'
                  )
                : '',
              locked: selectedRowData.locked,
              life_time: parseInt(selectedRowData.life_time.toString()),
              first_login: selectedRowData.first_login,
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
        console.log(response);
        setSubmittingAdd(false);
        setOutStatus(response.data.status);
        setOutMessage(response.data.message);
        if (response.data.status === 0) {
          setOutId(response.data.outid);
          handleRefresh();
        }
      })
      .catch((error) => {
        console.log(error);
        setSubmittingAdd(false);
      });
  };

  const handleUpdate = () => {
    setOutId(0);
    const functionName = 'UPDATE_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${selectedRowData.user_id}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/users/onupdate`;

    axios
      .post(
        url,
        {
          Validation: {
            timestamp: timestamp,
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
              user_id: selectedRowData.user_id,
              user_name: selectedRowData.user_name,
              user_description: selectedRowData.user_description,
              email: selectedRowData.email,
              phone_number: selectedRowData.phone_number,
              start_effective_date: selectedRowData.start_effective_date
                ? moment(selectedRowData.start_effective_date).format(
                    'DD-MM-YYYY HH:mm:ss'
                  )
                : '',
              end_effective_date: selectedRowData.end_effective_date
                ? moment(selectedRowData.end_effective_date).format(
                    'DD-MM-YYYY HH:mm:ss'
                  )
                : '',
              locked: selectedRowData.locked,
              life_time: selectedRowData.life_time,
              first_login: selectedRowData.first_login,
              confirmed_by_email: false,
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
        console.log(response);
        if (response.data.status === 0) {
          handleRefresh();
        }
      })
      .catch((error) => {
        console.log(error);
      });
    close();
  };

  return (
    <Modal open={open} close={close}>
      <div className='custom-modal'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '-5px',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '1px solid #d8d8d8',
          }}
        >
          <h5>{selectedRowData.user_id ? <>Edit User</> : <>Add User</>}</h5>
          <button className='btn-no-style' onClick={close}>
            <MdClose size={24} />
          </button>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            *Username:
          </div>
          <div>
            <input
              className='input__field'
              type='text'
              placeholder='username'
              value={selectedRowData.user_name}
              name='user_name'
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            *User Description:
          </div>
          <div>
            <input
              type='text'
              className='input__field'
              placeholder='user description'
              value={selectedRowData.user_description}
              name='user_description'
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            *Email:
          </div>
          <div>
            <input
              className='input__field'
              type='email'
              placeholder='email'
              value={selectedRowData.email}
              name='email'
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            *Phone Number:
          </div>
          <div>
            <input
              className='input__field'
              type='text'
              placeholder='phone number'
              value={selectedRowData.phone_number}
              name='phone_number'
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            *Start Effective Date:
          </div>
          <div>
            <input
              className='input__field'
              type='datetime-local'
              placeholder='username'
              value={selectedRowData.start_effective_date}
              name='start_effective_date'
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            End Effective Date:
          </div>
          <div>
            <input
              className='input__field'
              type='datetime-local'
              placeholder='end effective date'
              value={selectedRowData.end_effective_date}
              name='end_effective_date'
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            Locked:
          </div>
          <div>
            <input
              type='checkbox'
              checked={selectedRowData.locked}
              name='locked'
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            First Login:
          </div>
          <div>
            <input
              type='checkbox'
              checked={selectedRowData.first_login}
              name='first_login'
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            Life Time (days):
          </div>
          <div>
            <input
              className='input__field'
              placeholder='100'
              value={selectedRowData.life_time}
              name='life_time'
              type='number'
              min={0}
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div
            className='text-nowrap'
            style={{ width: '150px', textAlign: 'end', marginRight: '10px' }}
          >
            Created By:
          </div>
          <div>
            <input
              className='input__field'
              placeholder='Created by'
              value={selectedRowData.created_by_name}
              name='created_by_name'
              type='text'
              readOnly
            />
          </div>
        </div>
        <div>
          <small>*) Required field</small>
        </div>
        <div
          style={{
            borderTop: '1px solid #d8d8d8',
            paddingTop: '20px',
            justifyContent: 'flex-end',
            display: 'flex',
          }}
        >
          <button
            className='secondary-btn'
            onClick={() => {
              close();
              setOutId(0);
            }}
          >
            Close
          </button>
          <button
            className='primary-btn'
            onClick={selectedRowData.user_id ? handleUpdate : handleAdd}
          >
            {selectedRowData.user_id ? <>Update</> : <>Add</>}
          </button>
        </div>
      </div>
    </Modal>
  );
}
