import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
import { IoIosClose, IoMdOpen } from 'react-icons/io';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { FormIdContext } from '../../components/MainArea';

import {Modal} from '../../components/Modal';
import { TableGrid } from '../../components/TableGrid';
import { ThemeCtx } from '../Home';
import ResponsibilitiesLov from './ResponsibilitiesLov';
import { User } from './Users';
import AddBusinessUnits from './AddBusinessUnits';
import { FiEdit2 } from 'react-icons/fi';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

export interface DataResponsbility {
  created_by: number;
  created_by_name: string;
  creation_date: string;
  end_effective_date: string;
  id: number;
  last_update_date: string;
  last_updated_by: number;
  last_updated_name: string;
  responsibility_description: string;
  responsibility_id: number;
  responsibility_name: string;
  start_effective_date: string;
  user_id: number;
}

export default function AddUserResponsibilities({
  selectedRow,
  open,
  close,
}: {
  selectedRow: User;
  open: boolean;
  close: () => void;
}) {
  const [darkMode, setDarkMode] = useContext(ThemeCtx);
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

  const columnResponsibility = [
    {
      column: 'Responsibility Name',
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
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [addInline, setAddInline] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(true);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openAddBU, setOpenAddBU] = useState(false);
  const [openResponsibilityLOV, setOpenResponsibilityLOV] = useState(false);
  const [selectedLovRow, setSelectedLovRow] = useState({
    responsibility_id: 0,
    responsibility_name: '',
    responsibility_description: '',
  });

  const [effectiveDateAddResponsibility, setEffectiveDateAddResponsibility] =
    useState('');
  const [
    endEffectiveDateAddResponsibility,
    setEndEffectiveDateAddResponsibility,
  ] = useState('');

  const [editRowId, seteditRowId] = useState(0);
  const [editRowData, setEditRowData] = useState({
    id: 0,
    responsibility_id: 0,
    start_effective_date: '',
    end_effective_date: '',
  });

  const handleChangeUpdateUserResponsibility = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditRowData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [dataUserResponsibility, setDataUserResponsibility] = useState<
    DataResponsbility[]
  >([
    {
      created_by: 0,
      created_by_name: '',
      creation_date: '',
      end_effective_date: '',
      id: 0,
      last_update_date: '',
      last_updated_by: 0,
      last_updated_name: '',
      responsibility_description: '',
      responsibility_id: 0,
      responsibility_name: '',
      start_effective_date: '',
      user_id: 0,
    },
  ]);

  const [selectedResponsibility, setSelectedResponsibility] =
    useState<DataResponsbility>({
      created_by: 0,
      created_by_name: '',
      creation_date: '',
      end_effective_date: '',
      id: 0,
      last_update_date: '',
      last_updated_by: 0,
      last_updated_name: '',
      responsibility_description: '',
      responsibility_id: 0,
      responsibility_name: '',
      start_effective_date: '',
      user_id: 0,
    });
  const [outErrorMessage, setOutErrorMessage] = useState('');

  const getUserResponsibilities = useCallback(() => {
    const functionName = 'SELECT_ALLOWED';
    const url = `${baseURL}/prn/fnd/users/responsibility/onselect`;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${group_function_id}${formId}${functionName}${user.session}${selectedRow.user_id}${timestamp}${secretKey}`
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
              keyword: '%',
              pageNumber: 1,
              pageSize: 10,
            },
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
        setDataUserResponsibility(response.data.Data);
        if (response.data.Reply.status === 1) {
          setOutErrorMessage(response.data.Reply.message);
        }
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize, updateTrigger, selectedRow, open]);

  useEffect(() => {
    if (!open) return;
    getUserResponsibilities();
  }, [getUserResponsibilities]);

  const handleUpdateUserResponsibility = () => {
    const functionName = 'UPDATE_RESPONSIBILITY_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${group_function_id}${formId}${functionName}${editRowData.id}${editRowData.responsibility_id}${user.session}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/responsibility/onupdate`;

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
              id: editRowData.id,
              responsibility_id: editRowData.responsibility_id,
              start_effective_date: editRowData.start_effective_date
                ? moment(editRowData.start_effective_date).format(
                    'DD-MM-YYYY HH:mm:ss'
                  )
                : '',
              end_effective_date: editRowData.end_effective_date
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

  const [openConfirmAdd, setOpenConfirmAdd] = useState(false);
  const [outMessageAddUserResponsibility, setOutMessageAddUserResponsibility] =
    useState('');
  const [submittingAddUserResponsibility, setSubmittingAddUserResponsibility] =
    useState(false);
  const [outStatus, setOutStatus] = useState(0);

  const handleSaveAddResponsibility = () => {
    const functionName = 'ADD_RESPONSIBILITY_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${group_function_id}${formId}${functionName}${user.session}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/responsibility/oninsert`;
    setSubmittingAddUserResponsibility(true);
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
              responsibility_id: selectedLovRow.responsibility_id,
              start_effective_date: effectiveDateAddResponsibility
                ? moment(effectiveDateAddResponsibility).format(
                    'DD-MM-YYYY HH:mm:ss'
                  )
                : '',
              end_effective_date: endEffectiveDateAddResponsibility
                ? moment(endEffectiveDateAddResponsibility).format(
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
        console.log(response.data);
        setOutStatus(response.data.status);
        setOutMessageAddUserResponsibility(response.data.message);
        if (response.data.status === 0) {
          setUpdateTrigger(!updateTrigger);
        }
      })

      .catch((err) => console.log(err))
      .finally(() => setSubmittingAddUserResponsibility(false));
    setAddInline(!addInline);
    setSelectedLovRow({
      responsibility_id: 0,
      responsibility_name: '',
      responsibility_description: '',
    });
    setEndEffectiveDateAddResponsibility('');
    setEffectiveDateAddResponsibility('');
  };

  const [
    submittingDeleteUserResponsibility,
    setSubmittingDeleteUserResponsibility,
  ] = useState(false);
  const [
    outMessageDeleteUserResponsibility,
    setOutMessageDeleteUserResponsibility,
  ] = useState('');

  const handleDeleteUserResponsibility = () => {
    const functionName = 'DELETE_ALLOWED';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    const md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${group_function_id}${formId}${functionName}${editRowId}${selectedRow.user_id}${user.session}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/responsibility/ondelete`;
    setSubmittingDeleteUserResponsibility(true);
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
              id: editRowId,
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
        console.log(response);
        setOutMessageDeleteUserResponsibility(response.data.message);
        setOutStatus(response.data.status);
        if (response.data.status === 0) {
          setUpdateTrigger(!updateTrigger);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setSubmittingDeleteUserResponsibility(false));
  };

  const [openAddBUFailed, setOpenAddBUFailed] = useState(false);
  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      setSearchKeyword(searchQuery);
    }
  };

  useEffect(() => {
    console.log(selectedLovRow);
  }, [selectedLovRow]);
  return (
    <>
      <Modal open={open} close={close}>
        <div
          className={darkMode ? 'dark' : 'bright'}
          style={{
            padding: '20px',
            width: '750px',
            borderRadius: '10px',
          }}
        >
          <p>Add Responsibilities</p>
          <div>
            <label>Username</label>
            <br />
            <input
              onKeyDown={keyDownHandler}
              type='text'
              name='password'
              value={selectedRow.user_name || ''}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>User Description</label>
            <br />
            <input
              type='text'
              name='confirm'
              value={selectedRow.user_description}
            />
          </div>
          <TableGrid
            column={columnResponsibility}
            error={outErrorMessage}
            heightPercentage={80}
          >
            <tr hidden={addInline}>
              <td className='text-nowrap'>
                <input
                  type='text'
                  onKeyDown={keyDownHandler}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  onClick={() => setOpenResponsibilityLOV(true)}
                >
                  <IoMdOpen size={20} />
                </button>
              </td>
              <td className='text-nowrap'>
                <input
                  type='datetime-local'
                  value={effectiveDateAddResponsibility}
                  onChange={(e) =>
                    setEffectiveDateAddResponsibility(e.target.value)
                  }
                />
              </td>
              <td className='text-nowrap'>
                <input
                  type='datetime-local'
                  value={endEffectiveDateAddResponsibility}
                  onChange={(e) =>
                    setEndEffectiveDateAddResponsibility(e.target.value)
                  }
                />
              </td>
            </tr>
            {dataUserResponsibility &&
              dataUserResponsibility.map((d, i) => (
                <React.Fragment key={i}>
                  {editRowData && editRowData.id === d.id ? (
                    <tr>
                      <td className='text-nowrap'>{d.responsibility_name}</td>
                      <td>
                        <input
                          type='datetime-local'
                          value={editRowData.start_effective_date}
                          name='start_effective_date'
                          onChange={handleChangeUpdateUserResponsibility}
                        />
                      </td>
                      <td>
                        <input
                          type='datetime-local'
                          value={editRowData.end_effective_date}
                          onChange={handleChangeUpdateUserResponsibility}
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
                            handleUpdateUserResponsibility();
                            seteditRowId(0);
                            setEditRowData({
                              id: 0,
                              responsibility_id: 0,
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
                              responsibility_id: 0,
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
                        setSelectedResponsibility(d);
                      }}
                    >
                      <td
                        className='text-nowrap'
                        style={{
                          backgroundColor: editRowId === d.id ? 'pink' : '',
                        }}
                      >
                        {d.responsibility_name}
                      </td>
                      <td className='text-nowrap'>
                        {moment(d.start_effective_date).format(
                          'DD-MM-YYYY HH:mm:ss'
                        )}
                      </td>
                      <td className='text-nowrap'>
                        {d.end_effective_date
                          ? moment(d.end_effective_date).format(
                              'DD-MM-YYYY HH:mm:ss'
                            )
                          : d.end_effective_date}
                      </td>
                      <td className='text-nowrap'>
                        <button
                          data-bs-toggle='tooltip'
                          data-bs-placement='top'
                          title='Edit'
                          className='btn-no-style'
                          onClick={() => {
                            seteditRowId(d.id);
                            setEditRowData(d);
                          }}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          data-bs-toggle='tooltip'
                          data-bs-placement='top'
                          title='Delete'
                          className='btn-no-style'
                          onClick={() => setOpenConfirmDelete(true)}
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
                seteditRowId(0);
                setEditRowData({
                  id: 0,
                  responsibility_id: 0,
                  start_effective_date: '',
                  end_effective_date: '',
                });
                setDataUserResponsibility([]);
                setAddInline(true);
                setEndEffectiveDateAddResponsibility('');
                setEffectiveDateAddResponsibility('');
                setOutErrorMessage('');
                setSelectedResponsibility({
                  created_by: 0,
                  created_by_name: '',
                  creation_date: '',
                  end_effective_date: '',
                  id: 0,
                  last_update_date: '',
                  last_updated_by: 0,
                  last_updated_name: '',
                  responsibility_description: '',
                  responsibility_id: 0,
                  responsibility_name: '',
                  start_effective_date: '',
                  user_id: 0,
                });
                setSelectedLovRow({
                  responsibility_id: 0,
                  responsibility_name: '',
                  responsibility_description: '',
                });
                setSearchQuery('');
                setSearchKeyword('');
                close();
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
                  ? () => setAddInline(!addInline)
                  : () => {
                      setOpenConfirmAdd(true);
                    }
              }
            >
              {addInline ? <>Add Responsibilities</> : <>Save</>}
            </button>
            <button
              style={{
                border: 'none',
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '10px',
                padding: '5px 20px',
                height: '35px',
              }}
              onClick={
                selectedResponsibility.responsibility_name
                  ? () => setOpenAddBU(true)
                  : () => setOpenAddBUFailed(true)
              }
            >
              Add Business Units
            </button>
          </div>
        </div>
      </Modal>
      <Modal open={openConfirmDelete} close={() => setOpenConfirmDelete(false)}>
        <ConfirmationDialog
          caption='Are you sure?'
          submitState={submittingDeleteUserResponsibility}
          outMessage={{
            message: outMessageDeleteUserResponsibility,
            status: outStatus,
          }}
          handleClose={() => {
            setOpenConfirmDelete(false);
            setOutMessageDeleteUserResponsibility('');
          }}
          handleNo={() => setOpenConfirmDelete(false)}
          handleYes={handleDeleteUserResponsibility}
        />
      </Modal>
      <Modal open={openAddBUFailed} close={() => setOpenAddBUFailed(false)}>
        <div className='custom-modal'>
          <p>Select Responsibility First, Please!</p>
          <button onClick={() => setOpenAddBUFailed(false)}>Close</button>
        </div>
      </Modal>
      <Modal open={openConfirmAdd} close={() =>  setOpenConfirmAdd(false)}>
        <ConfirmationDialog
          caption='Are you sure?'
          submitState={submittingAddUserResponsibility}
          outMessage={{
            message: outMessageAddUserResponsibility,
            status: outStatus,
          }}
          handleClose={() => {
            setOpenConfirmAdd(false);
            setOutMessageAddUserResponsibility('');
            setSearchQuery('');
            setSearchKeyword('');
          }}
          handleNo={() => setOpenConfirmAdd(false)}
          handleYes={handleSaveAddResponsibility}
        />
      </Modal>
      <ResponsibilitiesLov
        open={openResponsibilityLOV}
        setOpenResponsibilityLov={setOpenResponsibilityLOV}
        close={() => setOpenResponsibilityLOV(false)}
        setSelectedLovRow={setSelectedLovRow}
        selectedRowData={selectedRow}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
      <AddBusinessUnits
        open={openAddBU}
        close={() => setOpenAddBU(false)}
        selectedRow={selectedResponsibility}
        selectedUserData={selectedRow}
      />
    </>
  );
}
