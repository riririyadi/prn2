import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DraggableCore } from 'react-draggable';
import Draggable from 'react-draggable';
import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { IoIosClose, IoMdOpen } from 'react-icons/io';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { FormIdContext } from '../../components/MainArea';
import {Modal} from '../../components/Modal';
import { Paging } from '../../components/Paging';
import { TableGrid } from '../../components/TableGrid';
import { ThemeCtx } from '../Home';
import { DataResponsbility } from './AddUserResponsibilities';
import { User } from './Users';
import { FiSearch } from 'react-icons/fi';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

function BusinessUnitLov({
  open,
  close,
  selectedLovRow,
  setSelectedLovRow,
  selectedRowData,
  selectedUserData,
}: {
  open: boolean;
  close: () => void;
  selectedLovRow: {
    bu_code: string;
    bu_description: string;
    bu_id: number;
  };
  setSelectedLovRow: React.Dispatch<
    React.SetStateAction<{
      bu_code: string;
      bu_description: string;
      bu_id: number;
    }>
  >;
  selectedRowData: DataResponsbility;
  selectedUserData: User;
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
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([
    {
      bu_id: 0,
      bu_code: '',
      bu_description: '',
    },
  ]);

  const [selectedRow, setSelectedRow] = useState({
    bu_id: 0,
    bu_code: '',
    bu_description: '',
  });

  const lovRef = useRef<HTMLDivElement>(null);

  const columnBU = [
    {
      column: 'BU Code',
    },
    {
      column: 'BU Description',
    },
  ];

  useEffect(() => {
    const functionName = 'SELECT_ALLOWED';
    const url = `${baseURL}/prn/fnd/users/businessunit/onselect_lov_bu`;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${group_function_id}${formId}${functionName}${user.session}${selectedRowData.user_id}${selectedRowData.responsibility_id}${timestamp}${secretKey}`
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
            Responsibility: {
              user_id: selectedRowData.user_id,
              responsibility_id: selectedRowData.responsibility_id,
            },
            ParamQuery: {
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
        setData(response.data.Data);
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize]);

  useEffect(() => {
    const functionName = 'SELECT_ALLOWED';
    const url = `${baseURL}/prn/fnd/users/businessunit/oncount_lov_bu`;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${group_function_id}${formId}${functionName}${user.session}${selectedRowData.user_id}${selectedRowData.responsibility_id}${timestamp}${secretKey}`
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
            Responsibility: {
              user_id: selectedRowData.user_id,
              responsibility_id: selectedRowData.responsibility_id,
            },
            ParamQuery: {
              keyword: `${keyword}%`,
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
  }, [keyword, pageNumber, pageSize]);

  return (
    <Modal open={open} close={close} level={4}>
     
        <div
          ref={lovRef}
          className={darkMode ? 'dark' : 'bright'}
          style={{
            padding: '20px',
            width: '400px',
            borderRadius: '10px',
          }}
        >
          <p>List Of Business Unit</p>

          <div style={{ marginBottom: '20px' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setKeyword(searchQuery);
                setPageNumber(1);
              }}
            >
              <input
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
          <TableGrid column={columnBU}>
            {data &&
              data.map((d, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedRow(d)}
                  onDoubleClick={() => {
                    setSelectedLovRow(d);
                    close();
                  }}
                  style={{
                    backgroundColor: darkMode
                      ? selectedRow.bu_id === d.bu_id
                        ? 'maroon'
                        : ''
                      : selectedRow.bu_id === d.bu_id
                      ? 'pink'
                      : '',
                  }}
                >
                  <td
                    style={{
                      backgroundColor:
                        selectedRow.bu_id === d.bu_id ? 'pink' : '',
                    }}
                  >
                    {d.bu_code}
                  </td>
                  <td>{d.bu_description}</td>
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
                setKeyword('');
                close();
              }}
            >
              Close
            </button>
            <button
              className='primary-btn'
              onClick={() => {
                setSelectedLovRow(selectedRow);
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

export default function AddBusinessUnits({
  open,
  close,
  selectedRow,
  selectedUserData,
}: {
  open: boolean;
  close: () => void;
  selectedRow: DataResponsbility;
  selectedUserData: User;
}) {
  const [darkMode, setDarkMode] = useContext(ThemeCtx);
  const formId = useContext(FormIdContext);
  const columnBU = [
    {
      column: 'Business Unit Name',
    },
    {
      column: 'Effective Date',
    },
    {
      column: 'Expire Date',
    },
    {
      column: 'Action',
    },
  ];

  const lovRef = useRef<HTMLDivElement>(null);

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

  const [openBULov, setopenBULov] = useState(false);
  const [selectedLovRow, setSelectedLovRow] = useState({
    bu_code: '',
    bu_description: '',
    bu_id: 0,
  });
  const [startEffectiveDateAddBU, setStartEffectiveDateAddBU] = useState('');
  const [endEffectiveDateAddBU, setEndEffectiveDateAddBU] = useState('');
  const [data, setData] = useState([
    {
      bu_code: '',
      bu_description: '',
      bu_id: 0,
      created_by: 0,
      created_by_name: '',
      creation_date: '',
      expire_date: '',
      id: 0,
      last_update_date: '',
      last_updated_by: 0,
      last_updated_name: '',
      responsibility_id: 0,
      start_date: '',
      user_id: 0,
    },
  ]);

  const [editRowId, seteditRowId] = useState(0);
  const [editRowData, setEditRowData] = useState({
    id: 0,
    bu_id: 0,
    start_effective_date: '',
    end_effective_date: '',
  });
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleChangeUpdateUserBU = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditRowData((prevData) => ({ ...prevData, [name]: value }));
  };
  const [updateTrigger, setUpdateTrigger] = useState(true);

  const handleUpdateUserBU = () => {
    const functionName = 'EXPIRE_BUSINESS_UNIT_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${group_function_id}${formId}${functionName}${editRowData.id}${user.session}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/businessunit/onupdate`;

    axios
      .put(
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
            Responsibility: {
              user_id: selectedRow.user_id,
              responsibility_id: selectedRow.responsibility_id,
            },
            BusinessUnit: {
              id: editRowData.id,
              bu_id: editRowData.bu_id,
              start_date: editRowData.start_effective_date
                ? moment(editRowData.start_effective_date).format(
                    'DD-MM-YYYY HH:mm:ss'
                  )
                : '',
              expire_date: editRowData.end_effective_date
                ? moment(editRowData.end_effective_date).format(
                    'DD-MM-YYYY HH:mm:ss'
                  )
                : '',
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
          setUpdateTrigger(!updateTrigger);
        }
      })
      .catch((err) => console.log(err));
  };

  const [submitting, setSubmitting] = useState(false);
  const [outMessage, setOutMessage] = useState('');
  const [outStatus, setOutStatus] = useState(0);

  const handleDeleteUserBU = () => {
    const functionName = 'DELETE_BUSINESS_UNIT_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${group_function_id}${formId}${functionName}${editRowId}${user.session}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/businessunit/ondelete`;
    setSubmitting(true);
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
            Responsibility: {
              user_id: selectedRow.user_id,
              responsibility_id: selectedRow.responsibility_id,
            },
            BusinessUnit: {
              id: editRowId,
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
        setOutMessage(response.data.message);
        setOutStatus(response.data.status);
        if (response.data.status === 0) {
          setUpdateTrigger(!updateTrigger);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setSubmitting(false));
  };

  const getUserBU = useCallback(() => {
    const functionName = 'SELECT_ALLOWED';
    const url = `${baseURL}/prn/fnd/users/businessunit/onselect`;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${group_function_id}${formId}${functionName}${user.session}${selectedUserData.user_id}${selectedRow.responsibility_id}${timestamp}${secretKey}`
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
            Responsibility: {
              user_id: selectedUserData.user_id,
              responsibility_id: selectedRow.responsibility_id,
            },
            ParamQuery: {
              pageNumber: 1,
              pageSize: 10,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            apikey: apiKey,
            clientsignature: md5hash,
            log: 'YES',
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setData(response.data.Data);
      })
      .catch((error) => console.log(error));
    console.log(selectedUserData.user_id, selectedRow.responsibility_id);
  }, [selectedRow, open, updateTrigger]);

  useEffect(() => {
    if (!open) return;
    getUserBU();
  }, [getUserBU]);

  useEffect(() => {
    console.log(editRowData);
  }, [editRowData]);

  const handleSaveAddBU = () => {
    const functionName = 'ADD_BUSINESS_UNIT_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${
        user.user_id
      }${responsibility_id}${group_function_id}${formId}${functionName}${
        user.session
      }${selectedLovRow.bu_id}${moment(startEffectiveDateAddBU).format(
        'DD-MM-YYYY HH:mm:ss'
      )}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/businessunit/oninsert`;
    // setSubmittingAddUserResponsibility(true);
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
            Responsibility: {
              user_id: selectedRow.user_id,
              responsibility_id: selectedRow.responsibility_id,
            },
            BusinessUnit: {
              bu_id: selectedLovRow.bu_id,
              start_date: startEffectiveDateAddBU
                ? moment(startEffectiveDateAddBU).format('DD-MM-YYYY HH:mm:ss')
                : '',
              expire_date: endEffectiveDateAddBU
                ? moment(endEffectiveDateAddBU).format('DD-MM-YYYY HH:mm:ss')
                : '',
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            apikey: apiKey,
            clientsignature: md5hash,
            log: 'YES',
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        // setOutStatus(response.data.status);
        // setOutMessageAddUserResponsibility(response.data.message);
        if (response.data.status === 0) {
          setUpdateTrigger(!updateTrigger);
        }
      })
      .catch((err) => console.log(err));
    // .finally(() => setSubmittingAddUserResponsibility(false));
    // setAddInline(!addInline);
    // setSelectedLovRow({
    //   responsibility_id: 0,
    //   responsibility_name: '',
    //   responsibility_description: '',
    // });
    // setEndEffectiveDateAddResponsibility('');
    // setEffectiveDateAddResponsibility('');
  };

  const [addInline, setAddInline] = useState(true);

  return (
    <>
      <Modal open={open} close={close}>
       
          <div
            ref={lovRef}
            style={{
              padding: '20px',
              width: '650px',
              borderRadius: '10px',
            }}
          >
            <p>Add Business Units</p>
            <div style={{ display: 'flex' }}>
              <div>
                <label>Username</label>
                <br />
                <input
                  type='text'
                  name='password'
                  value={selectedUserData.user_name}
                  readOnly
                />
              </div>
              <div style={{ marginLeft: '10px' }}>
                <label>Responsibility Name</label>
                <br />
                <input
                  type='text'
                  name='password'
                  value={selectedRow.responsibility_name}
                  readOnly
                />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>User Description</label>
              <br />
              <input
                type='text'
                name='confirm'
                value={selectedUserData.user_name}
                readOnly
              />
            </div>
            <TableGrid column={columnBU} heightPercentage={80}>
              <tr style={{ width: '200px' }} hidden={addInline}>
                <td className='text-nowrap'>
                  <input
                    type='text'
                    readOnly
                    value={selectedLovRow.bu_description}
                  />
                  <button
                    className='btn-lov'
                    data-bs-toggle='tooltip'
                    data-bs-placement='top'
                    title='Open'
                    style={{
                      border: 'none',
                      borderRadius: '5px',
                      padding: '3px 5px',
                      marginLeft: '5px',
                    }}
                    onClick={() => setopenBULov(true)}
                  >
                    <IoMdOpen size={20} />
                  </button>
                </td>
                <td className='text-nowrap'>
                  <input
                    type='datetime-local'
                    value={startEffectiveDateAddBU}
                    onChange={(e) => setStartEffectiveDateAddBU(e.target.value)}
                  />
                </td>
                <td className='text-nowrap'>
                  <input
                    type='datetime-local'
                    value={endEffectiveDateAddBU}
                    onChange={(e) => setEndEffectiveDateAddBU(e.target.value)}
                  />
                </td>
              </tr>
              {data &&
                data.map((d, i) => (
                  <React.Fragment key={i}>
                    {editRowData && editRowData.id === d.id ? (
                      <tr>
                        <td className='text-nowrap'>{d.bu_description}</td>
                        <td>
                          <input
                            type='datetime-local'
                            value={editRowData.start_effective_date}
                            name='start_effective_date'
                            onChange={handleChangeUpdateUserBU}
                          />
                        </td>
                        <td>
                          <input
                            type='datetime-local'
                            value={editRowData.end_effective_date}
                            onChange={handleChangeUpdateUserBU}
                            name='end_effective_date'
                          />
                        </td>
                        <td>
                          <button
                            className='btn-no-style'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='Save'
                            onClick={() => {
                              handleUpdateUserBU();
                              seteditRowId(0);
                              setEditRowData({
                                id: 0,
                                bu_id: 0,
                                start_effective_date: '',
                                end_effective_date: '',
                              });
                            }}
                          >
                            <AiOutlineSave />
                          </button>
                          <button
                            className='btn-no-style'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='Cancel'
                            onClick={() => {
                              seteditRowId(0);
                              setEditRowData({
                                id: 0,
                                bu_id: 0,
                                start_effective_date: '',
                                end_effective_date: '',
                              });
                            }}
                          >
                            <IoIosClose size={20} />
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr
                        style={{
                          backgroundColor: editRowId === d.id ? 'pink' : '',
                        }}
                        onClick={() => {
                          seteditRowId(d.id);
                        }}
                      >
                        <td
                          className='text-nowrap'
                          style={{
                            backgroundColor: editRowId === d.id ? 'pink' : '',
                          }}
                        >
                          {d.bu_description}
                        </td>
                        <td className='text-nowrap'>
                          {d.start_date
                            ? moment(d.start_date).format('DD-MM-YYYY HH:mm:ss')
                            : d.start_date}
                        </td>
                        <td className='text-nowrap'>
                          {d.expire_date
                            ? moment(d.expire_date).format(
                                'DD-MM-YYYY HH:mm:ss'
                              )
                            : d.expire_date}
                        </td>
                        <td className='text-nowrap'>
                          <button
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='Edit'
                            className='btn-no-style'
                            onClick={() => {
                              seteditRowId(d.id);
                              setEditRowData({
                                id: d.id,
                                bu_id: d.bu_id,
                                start_effective_date: d.start_date,
                                end_effective_date: d.expire_date,
                              });
                            }}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='Delete'
                            className='btn-no-style'
                            onClick={() => {
                              setOpenConfirmDelete(true);
                              seteditRowId(d.id);
                              // setEditRowData({
                              //   id: d.id,
                              //   bu_id: d.bu_id,
                              //   start_effective_date: d.start_date,
                              //   end_effective_date: d.expire_date,
                              // });
                            }}
                          >
                            <AiOutlineDelete />
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </TableGrid>
            <div style={{ marginTop: '20px' }}>
              <button
                style={{
                  border: 'none',
                  backgroundColor: '#e8e8e8',
                  borderRadius: '10px',
                  padding: '5px 20px',
                  width: '100px',
                  marginRight: '10px',
                  height: '35px',
                }}
                onClick={() => {
                  setSelectedLovRow({
                    bu_code: '',
                    bu_description: '',
                    bu_id: 0,
                  });
                  setStartEffectiveDateAddBU('');
                  setEndEffectiveDateAddBU('');
                  close();
                  setAddInline(true);
                  setEditRowData({
                    id: 0,
                    bu_id: 0,
                    start_effective_date: '',
                    end_effective_date: '',
                  });
                  seteditRowId(0);
                }}
              >
                Close
              </button>
              <button
                style={{
                  border: 'none',
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '5px 20px',
                  height: '35px',
                  marginRight: '10px',
                }}
                onClick={
                  addInline
                    ? () => setAddInline(false)
                    : () => {
                        handleSaveAddBU();
                        setAddInline(true);
                        setSelectedLovRow({
                          bu_id: 0,
                          bu_code: '',
                          bu_description: '',
                        });
                        setStartEffectiveDateAddBU('');
                        setEndEffectiveDateAddBU('');
                      }
                }
              >
                {addInline ? <>Add BusinessUnit</> : <>Save</>}
              </button>
            </div>
          </div>
        
      </Modal>
      <BusinessUnitLov
        selectedUserData={selectedUserData}
        open={openBULov}
        close={() => setopenBULov(false)}
        selectedLovRow={selectedLovRow}
        setSelectedLovRow={setSelectedLovRow}
        selectedRowData={selectedRow}
      />
      <Modal open={openConfirmDelete} close={() => setOpenConfirmDelete(false)}>
        <ConfirmationDialog
          caption='Are you sure?'
          submitState={submitting}
          outMessage={{
            message: outMessage,
            status: outStatus,
          }}
          handleClose={() => {
            setOpenConfirmDelete(false);
            setOutMessage('');
          }}
          handleNo={() => setOpenConfirmDelete(false)}
          handleYes={handleDeleteUserBU}
        />
      </Modal>
    </>
  );
}
