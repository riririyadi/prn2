import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { FormIdContext } from '../../components/MainArea';
import {Modal} from '../../components/Modal';
import { Paging } from '../../components/Paging';
import { TableGrid } from '../../components/TableGrid';
import { ThemeCtx } from '../Home';
import { User } from './Users';
import { FiSearch } from 'react-icons/fi';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

export default function ResponsibilitiesLov({
  open,
  close,
  setSelectedLovRow,
  selectedRowData,
  searchQuery,
  setSearchQuery,
  searchKeyword,
  setSearchKeyword,
  setOpenResponsibilityLov,
}: {
  open: boolean;
  close: () => void;
  setSelectedLovRow: React.Dispatch<
    React.SetStateAction<{
      responsibility_id: number;
      responsibility_name: string;
      responsibility_description: string;
    }>
  >;
  selectedRowData: User;
  searchQuery: string;
  searchKeyword: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
  setOpenResponsibilityLov: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([
    {
      responsibility_id: 0,
      responsibility_name: '',
      responsibility_description: '',
    },
  ]);

  const [selectedRow, setSelectedRow] = useState({
    responsibility_id: 0,
    responsibility_name: '',
    responsibility_description: '',
  });

  const lovRef = useRef<HTMLDivElement>(null);

  const columnResponsibility = [
    {
      column: 'Responsibility Name',
    },
    {
      column: 'Responsibility Description',
    },
  ];

  useEffect(() => {
    const functionName = 'EXPIRED_ALLOWED';
    const url = `${baseURL}/prn/fnd/users/responsibility/onselectlovresponsibility`;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${user.user_id}${user.session}${responsibility_id}${group_function_id}${formId}${functionName}${searchKeyword}%${pageNumber}${pageSize}${timestamp}${secretKey}`
    );

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
              keyword: `${searchKeyword}%`,
              pageNumber,
              pageSize,
            },
            User: {
              user_id: selectedRowData.user_id,
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
        setData(response.data.Data);
        console.log(response.data);
        if (response.data.Data.length === 1) {
          setSelectedLovRow(response.data.Data[0]);
          setSearchQuery(response.data.Data[0].responsibility_name);
        }
        if (searchKeyword && response.data.Data.length > 1) {
          setOpenResponsibilityLov(true);
        }
      })
      .catch((error) => console.log(error));
  }, [searchKeyword, pageNumber, pageSize]);

  useEffect(() => {
    const functionName = 'SELECT_ALLOWED';
    const url = `${baseURL}/prn/fnd/users/responsibility/oncountlovresponsibility`;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${user.user_id}${user.session}${responsibility_id}${group_function_id}${formId}${functionName}${searchKeyword}%${pageNumber}${pageSize}${timestamp}${secretKey}`
    );

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
              keyword: `${searchKeyword}%`,
              pageNumber,
              pageSize,
            },
            User: {
              user_id: selectedRowData.user_id,
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
        setTotalRecord(response.data.total_record);
        console.log(response.data);
      })
      .catch((error) => console.log(error));
    console.log('User id ' + selectedRowData.user_id);
  }, [searchKeyword, pageNumber, pageSize]);

  return (
    <Modal open={open} close={close}>
        <div
          ref={lovRef}
          className={darkMode ? 'dark' : 'bright'}
          style={{
            padding: '20px',
            width: '400px',
            borderRadius: '10px',
          }}
        >
          <p>List Of Responsibility</p>

          <div style={{ marginBottom: '20px' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSearchKeyword(searchQuery);
                setPageNumber(1);
              }}
            >
              <input
                value={searchQuery}
                type='search'
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type='submit' className='btn-no-style'>
                <FiSearch
                  size={24}
                  style={{ marginRight: '10px' }}
                  className={darkMode ? 'dark' : 'bright'}
                />
              </button>
            </form>
          </div>
          <TableGrid column={columnResponsibility}>
            {data &&
              data.map((d, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedRow(d)}
                  onDoubleClick={() => {
                    setSearchQuery(d.responsibility_name);
                    setSelectedLovRow(d);
                    close();
                  }}
                  style={{
                    backgroundColor: darkMode
                      ? selectedRow.responsibility_id === d.responsibility_id
                        ? 'maroon'
                        : ''
                      : selectedRow.responsibility_id === d.responsibility_id
                      ? 'pink'
                      : '',
                  }}
                >
                  <td
                    style={{
                      backgroundColor:
                        selectedRow.responsibility_id === d.responsibility_id
                          ? 'pink'
                          : '',
                    }}
                  >
                    {d.responsibility_name}
                  </td>
                  <td>{d.responsibility_description}</td>
                </tr>
              ))}
          </TableGrid>
          <Paging
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalRecord={totalRecord}
            setPageNumber={setPageNumber}
          />
          <div style={{ marginTop: '20px' }}>
            <button
              className='secondary-btn'
              onClick={() => {
                setSearchKeyword('');
                close();
                setSelectedRow({
                  responsibility_id: 0,
                  responsibility_name: '',
                  responsibility_description: '',
                });
              }}
            >
              Close
            </button>
            <button
              className='primary-btn'
              onClick={() => {
                setSelectedLovRow(selectedRow);
                setSearchQuery(selectedRow.responsibility_name);
                close();
              }}
            >
              Select
            </button>
          </div>
        </div>
     
    </Modal>
  );
}
