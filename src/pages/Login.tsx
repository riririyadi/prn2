import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import moment from 'moment';
import {Modal} from '../components/Modal';
import { Loader } from '../components/Loader';
import axios from 'axios';
import md5 from 'md5';
import { useAuth } from '../utils/auth';
import { MessageBox } from '../components/MessageBox';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  let navigate = useNavigate();

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!username || !password) {
      return;
    }
    setIsLoading(true);
    let timestamp = moment().format('YYYYMMDDHHmmss');
    let md5hash = md5(`${username}${password}${timestamp}${secretKey}`);
    let url = `${baseURL}/prn/fnd/users/onlogin`;
    axios
      .post(
        url,
        {
          timestamp,
          user_name: username,
          user_password: password,
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
        setIsLoading(false);
        console.log(response.data);
        if (response.data.Reply.status === 0) {
          localStorage.setItem('user_data', JSON.stringify(response.data.Data));
          auth.login(response.data.Data);
          navigate('/home', { replace: true });
        }
        if (
          response.data.Reply.status === 1 ||
          response.data.Reply.status === 2
        ) {
          setErrorMessage(response.data.Reply.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  if (auth.user) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
        }}
      >
        <p>You're already login</p>
        <div>
          <button
            onClick={() => {
              auth.logout();
              localStorage.clear();
            }}
            style={{
              border: 'none',
              backgroundColor: '#e8e8e8',
              borderRadius: '10px',
              padding: '5px 20px',
              marginRight: '10px',
              width: '100px',
            }}
          >
            Sign Out
          </button>
          <button
            onClick={() => navigate('/home')}
            style={{
              border: 'none',
              backgroundColor: 'black',
              borderRadius: '10px',
              padding: '5px 20px',
              marginRight: '10px',
              color: 'white',
            }}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
      }}
    >
      <div className='login-form'>
        <form>
          <h3 style={{ marginBottom: '20px' }}>Sign In</h3>
          <input
            className='input-field'
            style={{ border: 'solid 1px black', marginBottom: '10px' }}
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            className='input-field'
            style={{ border: 'solid 1px black', marginBottom: '10px' }}
            type={isChecked ? 'text' : 'password'}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <input
            style={{ border: 'solid 1px black', marginBottom: '10px' }}
            type='checkbox'
            name='checkbox'
            id='checkbox'
            defaultChecked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />{' '}
          Show Password
          <br/>
          <button
            className="primary-btn" style={{width:"100%", marginTop:"10px"}}
            onClick={handleLogin}
          >
            {isLoading ? <>Logging In...</>:<>Log In</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
