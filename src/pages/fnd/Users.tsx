import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { CgLastpass, CgSandClock } from 'react-icons/cg';
import { FaUserLock } from 'react-icons/fa';
import { FormIdContext } from '../../components/MainArea';
import { MenuBar } from '../../components/MenuBar';
import {Modal} from '../../components/Modal';
import { Paging } from '../../components/Paging';
import { TableGrid } from '../../components/TableGrid';
import { ThemeCtx } from '../Home';
import AddUserResponsibilities from './AddUserResponsibilities';
import ChangeUserPassword from './ChangeUserPassword';
import EditUser from './EditUser';
import ExpireUser from './ExpireUser';
import LockUser from './LockUser';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

export interface User {
  company_id: number;
  user_id: number;
  user_name: string;
  user_password: string;
  confirm_password: string;
  user_description: string;
  email: string;
  phone_number: string;
  start_effective_date: string;
  end_effective_date: string;
  locked: boolean;
  first_login: boolean;
  life_time: number;
  last_change_password: string;
  how_many_failed: number;
  creation_date: string;
  created_by: number;
  created_by_name: string;
  last_update_date: string;
  last_updated_by: number;
  last_updated_by_name: string;
}

export default function Users() {
  const [darkMode, setDarkMode] = useContext(ThemeCtx);
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
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEditFailed, setOpenEditFailed] = useState(false);
  const [openLocked, setOpenLocked] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openExpire, setOpenExpire] = useState(false);
  const [openAddResponsibility, setOpenAddResponsibility] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [outId, setOutId] = useState(0);
  const [selectedRowData, setSelectedRowData] = useState<User>({
    company_id: 0,
    user_id: 0,
    user_name: '',
    user_password: '',
    confirm_password: '',
    user_description: '',
    email: '',
    phone_number: '',
    start_effective_date: '',
    end_effective_date: '',
    locked: false,
    first_login: false,
    life_time: 0,
    last_change_password: '',
    how_many_failed: 0,
    creation_date: '',
    created_by: 0,
    created_by_name: '',
    last_update_date: '',
    last_updated_by: 0,
    last_updated_by_name: '',
  });

  const [data, setData] = useState<User[]>([]);
  const [errorTable, setErrorTable] = useState('');
  const column = [
    {
      column: 'User Name',
    },
    {
      column: 'User Description',
    },
    {
      column: 'Email',
    },
    {
      column: 'Phone Number',
    },
    {
      column: 'Start Effective Date',
    },
    {
      column: 'End Effective Date',
    },
    {
      column: 'Locked',
    },
    {
      column: 'First Login',
    },
    {
      column: 'Life Time',
    },
    {
      column: 'Last Change Password',
    },
    {
      column: 'Creation Date',
    },
    {
      column: 'Creation By',
    },
    {
      column: 'Last Update Date',
    },
    {
      column: 'Last Updated By Name',
    },
  ];

  useEffect(() => {
    const functionName = 'SELECT_ALLOWED';
    const url = `${baseURL}/prn/fnd/users/oncount`;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
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
            ParamQuery: {
              pid: outId ? outId : null,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize, refresh]);

  useEffect(() => {
    const functionName = 'SELECT_ALLOWED';
    const url = `${baseURL}/prn/fnd/users/onselect`;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    console.log(outId);

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
            ParamQuery: {
              pid: outId ? outId : null,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        if (outId) {
          setSelectedRowData(response.data.Data[0]);
          return;
        }
        setData(response.data.Data);
        if (response.data.Reply.status === 1) {
          setErrorTable(response.data.Reply.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setActiveIndex(null));
  }, [keyword, pageNumber, pageSize, refresh]);

  const handleEdit = () => {
    if (selectedRowId === 0) {
      setOpenEditFailed(true);
      return;
    }
    setOpenEdit(true);
  };

  const handleAdd = () => {
    setSelectedRowData({
      company_id: 0,
      user_id: 0,
      user_name: '',
      user_password: '',
      confirm_password: '',
      user_description: '',
      email: '',
      phone_number: '',
      start_effective_date: '',
      end_effective_date: '',
      locked: false,
      first_login: false,
      life_time: 0,
      last_change_password: '',
      how_many_failed: 0,
      creation_date: '',
      created_by: 0,
      created_by_name: '',
      last_update_date: '',
      last_updated_by: 0,
      last_updated_by_name: '',
    });
    setOpenEdit(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    const checked = e.target.checked;
    const type = e.target.type;
    setSelectedRowData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOpenLocked = () => {
    if (selectedRowId === 0) {
      setOpenEditFailed(true);
      return;
    }
    setOpenLocked(true);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
    setKeyword('');
    setPageNumber(1);
  };

  const handleOpenChangePassword = () => {
    if (selectedRowId === 0) {
      setOpenEditFailed(true);
      return;
    }
    setOpenChangePassword(true);
  };

  const handleOpenExpire = () => {
    if (selectedRowId === 0) {
      setOpenEditFailed(true);
      return;
    }
    setOpenExpire(true);
  };

  const handleOpenAddResponsibility = () => {
    if (selectedRowId === 0) {
      setOpenEditFailed(true);
      return;
    }
    setOpenAddResponsibility(true);
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const refs = useRef(new Array(pageSize));

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (evt.key === 'ArrowUp' && activeIndex! >= 0) {
      if (activeIndex! > 0) {
        setActiveIndex(activeIndex! - 1);
      }
    }
    if (evt.key === 'ArrowDown' && activeIndex! >= 0) {
      if (activeIndex! < 9) {
        setActiveIndex(activeIndex! + 1);
      }
    }

    if (evt.key === 'Enter') {
      const index = refs.current[activeIndex!].tabIndex;
      setSelectedRowData(data[index]);
    }
  };

  useEffect(() => {
    console.log(selectedRowData);
  }, [selectedRowData]);

  return (
    <div
      className='component'
      
    >
      <MenuBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setKeyword={setKeyword}
        setPageNumber={setPageNumber}
        handleEdit={handleEdit}
        handleAdd={handleAdd}
        handleRefresh={handleRefresh}
      >
        <>
          <button
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Lock or Unlock User'
            onClick={handleOpenLocked}
          >
            <FaUserLock size={24} className={darkMode ? 'dark' : 'bright'} />
          </button>
          <button
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Change Password'
            onClick={handleOpenChangePassword}
          >
            <CgLastpass size={24} className={darkMode ? 'dark' : 'bright'} />
          </button>
          <button
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Expire User'
            onClick={handleOpenExpire}
          >
            <CgSandClock size={24} className={darkMode ? 'dark' : 'bright'} />
          </button>
          <button
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Add Responsibilities'
            onClick={handleOpenAddResponsibility}
          >
            <AiOutlineUsergroupAdd
              size={24}
              className={darkMode ? 'dark' : 'bright'}
            />
          </button>
        </>
      </MenuBar>
      <TableGrid column={column}>
        <tbody>
        {data &&
          data.map((u, i) => (
            <tr
              // className='frezee'
              ref={(el) => (refs.current[i] = el)}
              key={u.user_id}
              onClick={() => {
                setSelectedRowId(i);
                setSelectedRowData(u);
                setActiveIndex(i);
              }}
              tabIndex={i}
              style={{
                backgroundColor:
                  selectedRowData.user_id === u.user_id ? 'pink' : '',
                border: activeIndex === i ? '1px solid black' : 'none',
              }}
              onKeyDown={(evt) => handleKeyDown(evt)}
            >
              <td
                className='text-nowrap'
                style={{
                  backgroundColor:
                    selectedRowData.user_id === u.user_id ? 'pink' : '',
                  borderLeft: activeIndex === i ? '1px solid black' : 'none',
                  borderBottom: activeIndex === i ? '1px solid black' : 'none',
                  borderTop: activeIndex === i ? '1px solid black' : 'none',
                }}
              >
                {u.user_name}
              </td>
              <td
                className='text-nowrap'
                style={{
                  backgroundColor:
                    selectedRowData.user_id === u.user_id ? 'pink' : '',

                  borderTop: activeIndex === i ? '1px solid black' : 'none',
                  borderBottom: activeIndex === i ? '1px solid black' : 'none',
                }}
              >
                {u.user_description}
              </td>
              <td className='text-nowrap'>{u.email}</td>
              <td className='text-nowrap'>{u.phone_number}</td>
              <td className='text-nowrap'>
                {u.start_effective_date
                  ? moment(u.start_effective_date).format('DD-MM-YYYY HH:mm:ss')
                  : u.start_effective_date}
              </td>
              <td className='text-nowrap'>
                {u.end_effective_date
                  ? moment(u.end_effective_date).format('DD-MM-YYYY HH:mm:ss')
                  : u.end_effective_date}
              </td>
              <td>
                <input type='checkbox' checked={u.locked} readOnly />
              </td>
              <td>
                <input type='checkbox' checked={u.first_login} readOnly />
              </td>
              <td className='text-nowrap'>{u.life_time} days</td>
              <td className='text-nowrap'>{u.last_change_password}</td>
              <td className='text-nowrap'>
                {u.creation_date
                  ? moment(u.creation_date).format('DD-MM-YYYY HH:mm:ss')
                  : u.creation_date}
              </td>
              <td className='text-nowrap'>{u.created_by_name}</td>
              <td className='text-nowrap'>
                {u.last_update_date
                  ? moment(u.last_update_date).format('DD-MM-YYYY HH:mm:ss')
                  : u.last_update_date}
              </td>
              <td className='text-nowrap'>{u.last_updated_by_name}</td>
            </tr>
          ))}
          </tbody>
      </TableGrid>
      <Paging
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRecord={totalRecord}
        setPageNumber={setPageNumber}
      />
      <EditUser
        selectedRowData={selectedRowData}
        handleChange={handleChange}
        open={openEdit}
        close={() => setOpenEdit(false)}
        handleRefresh={handleRefresh}
        setOutId={setOutId}
      />
      <Modal open={openEditFailed} close={() => setOpenEditFailed(false)}>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            width: '400px',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <p>Select Row First Please!</p>
          <button onClick={() => setOpenEditFailed(false)}>Close</button>
        </div>
      </Modal>
      <ChangeUserPassword
        open={openChangePassword}
        selectedRow={selectedRowData}
        close={() => setOpenChangePassword(false)}
        handleRefresh={handleRefresh}
      />
      <LockUser
        open={openLocked}
        selectedRow={selectedRowData}
        handleRefresh={handleRefresh}
        close={() => setOpenLocked(false)}
      />
      <ExpireUser
        open={openExpire}
        selectedRow={selectedRowData}
        handleRefresh={handleRefresh}
        close={() => setOpenExpire(false)}
      />
      <AddUserResponsibilities
        selectedRow={selectedRowData}
        open={openAddResponsibility}
        close={() => setOpenAddResponsibility(false)}
      />
    </div>
  );
}
