import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { FiEdit, FiRefreshCcw } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { CgSearch } from 'react-icons/cg';
import { AiOutlineDelete } from 'react-icons/ai';
import {Modal} from '../components/Modal';
import Draggable from 'react-draggable';
import axios from 'axios';
import md5 from 'md5';
import { VscNewFile, VscSearch } from 'react-icons/vsc';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

interface DataForm {
  application_description: string;
  application_id: number;
  application_name: string;
  created_by: number;
  created_by_name: string;
  creation_date: string;
  file_name: string;
  form_description: string;
  form_id: number;
  form_name: string;
  form_type: number;
  form_type_name: string;
  last_update_date: string;
  last_updated_by: number;
  last_updated_by_name: string;
}

interface FormValue {
  form_id: number | null;
  form_name: string;
  form_description: string;
  form_type: number | null;
  form_type_name: string;
  file_name: string;
  application_id: number | null;
  application_name: string;
}

interface LovData {
  application_description: string;
  application_id: number | null;
  application_name: string;
}

export default function Form() {
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
  const [keyword, setKeyword] = useState('%');
  const [keywordLov, setKeywordLov] = useState('%');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSizeLov, setPageSizeLov] = useState(10);
  const [pageNumberLov, setPageNumberLov] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openLov, setOpenLov] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedRowLov, setSelectedRowLov] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [totalRecord, setTotalRecord] = useState<number | null>(null);
  const [data, setData] = useState<DataForm[]>([]);
  const [lovData, setLovData] = useState<LovData[]>([]);
  const [selectedLovValue, setSelectedLovValue] = useState<LovData>({
    application_description: '',
    application_id: null,
    application_name: '',
  });

  const [formValue, setFormValue] = useState<FormValue>({
    form_id: null,
    form_name: '',
    form_description: '',
    form_type: null,
    form_type_name: '',
    file_name: '',
    application_id: null,
    application_name: '',
  });

  useEffect(() => {
    console.log(formValue);
  }, [formValue]);

  const getListOfForms = useCallback(() => {
    setIsLoading(true);
    let timestamp = moment().format('YYYYMMDDHHmmss');
    let { responsibility_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/forms/onselect`;
    axios
      .post(
        url,
        {
          timestamp,
          company_id: user.company_id,
          user_id: user.user_id,
          responsibility_id,
          keyword,
          pageNumber,
          pageSize,
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
        setData(response.data.Data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [keyword, pageNumber, pageSize, user.company_id, user.user_id]);

  useEffect(() => {
    getListOfForms();
  }, [getListOfForms]);

  const countListOfForms = useCallback(() => {
    setIsLoading(true);
    let timestamp = moment().format('YYYYMMDDHHmmss');
    let { responsibility_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );

    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/forms/oncount`;
    axios
      .post(
        url,
        {
          timestamp,
          company_id: user.company_id,
          user_id: user.user_id,
          responsibility_id,
          keyword,
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [keyword, user.company_id, user.user_id]);

  const updateFormValue = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let timestamp = moment().format('YYYYMMDDHHmmss');
    let { responsibility_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${formValue.form_id}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/forms/onupdate`;
    axios
      .put(
        url,
        {
          timestamp,
          company_id: user.company_id,
          user_id: user.user_id,
          responsibility_id: responsibility_id,
          Params: formValue,
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const insertFormValue = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let timestamp = moment().format('YYYYMMDDHHmmss');
    let { responsibility_id } = JSON.parse(
      localStorage.getItem('responsibility_id') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/forms/oninsert`;
    axios
      .post(
        url,
        {
          timestamp,
          company_id: user.company_id,
          user_id: user.user_id,
          responsibility_id,
          Params: {
            form_name: formValue.form_name,
            form_description: formValue.form_description,
            form_type: formValue.form_type,
            file_name: formValue.file_name,
            application_id: selectedLovValue.application_id,
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
      })
      .catch((error) => {
        console.log(error);
      });

    console.log({
      form_name: formValue.form_name,
      form_description: formValue.form_description,
      form_type: formValue.form_type,
      file_name: formValue.file_name,
      application_id: selectedLovValue.application_id,
    });
  };

  //TODO : ganti method
  const deleteFormValue = () => {
    let timestamp = moment().format('YYYYMMDDHHmmss');
    let { responsibility_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${formValue.form_id}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/forms/ondelete`;
    axios
      .post(
        url,
        {
          timestamp,
          company_id: user.company_id,
          user_id: user.user_id,
          responsibility_id,
          Params: { form_id: formValue.form_id },
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLovApplication = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let timestamp = moment().format('YYYYMMDDHHmmss');
    let { responsibility_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/forms/onselect_lov_application`;
    axios
      .post(
        url,
        {
          timestamp,
          company_id: user.company_id,
          user_id: user.user_id,
          responsibility_id,
          keyword: keywordLov,
          pageNumber: pageNumberLov,
          pageSize: pageSizeLov,
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
        setLovData(response.data.Data);
        if (response.data.Reply.status === 0) {
          setOpenLov(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const PageInfo = () => {
    return (
      <span>
        {(pageNumber - 1) * pageSize + 1} -{' '}
        {pageNumber * pageSize > totalRecord! ? (
          <span>{totalRecord}</span>
        ) : (
          <span>{pageNumber * pageSize}</span>
        )}{' '}
        / {totalRecord}
      </span>
    );
  };

  useEffect(() => {
    countListOfForms();
  }, [countListOfForms]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(selectedLovValue);
  }, [selectedLovValue]);

  const wrapperRef = useRef(null);
  const tableRef = useRef(null);

  return (
    <div
      style={{
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: 'white',
      }}
      ref={wrapperRef}
    >
      <div className='d-flex justify-content-between'>
        <div>
          <button
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='New'
            onClick={() => {
              setIsOpen(true);
              setFormValue({
                form_id: null,
                form_name: '',
                form_description: '',
                form_type: null,
                form_type_name: '',
                file_name: '',
                application_id: null,
                application_name: '',
              });
            }}
          >
            <VscNewFile size={24} />
          </button>
          <button
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Edit'
          >
            <FiEdit size={24} />
          </button>
          <button
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Refresh'
          >
            <FiRefreshCcw size={24} />
          </button>
          <button
            className='menu-icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Delete'
            onClick={() => {
              if (formValue.form_id) setOpenDelete(true);
            }}
          >
            <AiOutlineDelete size={24} />
          </button>
        </div>
        <div>
          <VscSearch size={24} style={{ marginRight: '10px' }} />
          <input
            className='input-field'
            placeholder='enter keyword'
            type='search'
          />
        </div>
      </div>
      <div style={{ marginTop: '10px' }}></div>
      <table ref={tableRef} className='table table-striped table-hover'>
        <thead>
          <tr>
            <th scope='col'>No</th>
            <th scope='col'>Form Name</th>
            <th scope='col'>Form Description</th>
            <th scope='col'>Form Type</th>
            <th scope='col'>Component</th>
            <th scope='col'>Application</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((f, i) => (
              <tr
                style={{
                  backgroundColor: selectedRow === f.form_id ? 'pink' : '',
                }}
                key={f.form_name + f.application_name}
                onDoubleClick={() => {
                  setIsUpdating(true);
                  setFormValue({
                    form_id: f.form_id,
                    form_name: f.form_name,
                    form_description: f.form_description,
                    form_type: f.form_type,
                    form_type_name: f.form_type_name,
                    file_name: f.file_name,
                    application_id: f.application_id,
                    application_name: f.application_name,
                  });
                  setIsOpen(true);
                }}
                onClick={() => {
                  setSelectedRow(f.form_id);
                  setFormValue({
                    form_id: f.form_id,
                    form_name: f.form_name,
                    form_description: f.form_description,
                    form_type: f.form_type,
                    form_type_name: f.form_type_name,
                    file_name: f.file_name,
                    application_id: f.application_id,
                    application_name: f.application_name,
                  });
                }}
              >
                <th scope='row'>{(pageNumber - 1) * pageSize + (i + 1)}</th>
                <td>{f.form_name}</td>
                <td>{f.form_description}</td>
                <td>{f.form_type_name}</td>
                <td>{f.file_name}</td>
                <td>{f.application_name}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {!data && <p>No data</p>}
      <div className='d-flex justify-content-between'>
        <div>
          <button
            onClick={() => {
              if (pageNumber > 1) setPageNumber(pageNumber - 1);
            }}
            style={{
              border: 'none',
              backgroundColor: '#d2d2d2',
              padding: '5px 12px',
              borderRadius: '50%',
              marginRight: '10px',
            }}
            disabled={pageNumber === 1}
          >
            &lt;
          </button>
          <button
            onClick={() => {
              setPageNumber(pageNumber + 1);
            }}
            style={{
              border: 'none',
              backgroundColor: '#d2d2d2',
              padding: '5px 12px',
              borderRadius: '50%',
            }}
            disabled={pageNumber * pageSize > totalRecord!}
          >
            &gt;
          </button>
        </div>
        <div>{totalRecord && PageInfo()}</div>
      </div>
{/* 
      <Modal>
          <div className='d-flex'>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                width: '500px',
                padding: '20px',
              }}
            >
              <p className='fw-bold'>
                {isUpdating ? <>Update a Form</> : <>Add a Form</>}
              </p>
              <div className='d-flex'>
                <div style={{ width: '50%' }}>
                  <label>Form Name </label>
                </div>
                <div style={{ width: '50%' }}>
                  :{' '}
                  <input
                    value={formValue.form_name || ''}
                    name='form_name'
                    placeholder='enter the form name'
                    style={{
                      backgroundColor: '#e8e8e8',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '2px 10px',
                      width: '95%',
                    }}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='d-flex mt-2'>
                <div style={{ width: '50%' }}>
                  <label>Form Description</label>
                </div>
                <div style={{ width: '50%' }}>
                  :{' '}
                  <input
                    name='form_description'
                    value={formValue.form_description || ''}
                    placeholder='enter the form description'
                    style={{
                      backgroundColor: '#e8e8e8',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '2px 10px',
                      width: '95%',
                    }}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='d-flex mt-2'>
                <div style={{ width: '50%' }}>
                  <label htmlFor='form_type'>Form Type</label>
                </div>
                <div style={{ width: '50%' }}>
                  :{' '}
                  <select
                    name='form_type'
                    id='form_type'
                    style={{
                      backgroundColor: '#e8e8e8',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '2px 5px',
                      width: '95%',
                    }}
                    onChange={handleChange}
                  >
                    <option value={0}>Form</option>
                    <option value={1}>Report</option>
                  </select>
                </div>
              </div>
              <div className='d-flex mt-2'>
                <div style={{ width: '50%' }}>
                  <label>Component</label>
                </div>
                <div style={{ width: '50%' }}>
                  :{' '}
                  <input
                    name='file_name'
                    value={formValue.file_name || ''}
                    onChange={handleChange}
                    placeholder='enter the component name'
                    style={{
                      backgroundColor: '#e8e8e8',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '2px 10px',
                      width: '95%',
                    }}
                  />
                </div>
              </div>
              <div className='d-flex mt-2'>
                <div style={{ width: '50%' }}>
                  <label>Application</label>
                </div>
                <div style={{ width: '50%' }}>
                  :{' '}
                  <input
                    name='application_name'
                    readOnly
                    value={
                      selectedLovValue.application_description ||
                      formValue.application_name ||
                      ''
                    }
                    placeholder='enter the application name'
                    style={{
                      backgroundColor: '#e8e8e8',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '2px 10px',
                      width: '70%',
                    }}
                  />
                  <span
                    style={{
                      marginLeft: '12px',
                      backgroundColor: '#e8e8e8',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '2px 10px',
                    }}
                    onClick={getLovApplication}
                  >
                    ...
                    <CgSearch />
                  </span>
                </div>
              </div>
              <div className='d-flex justify-content-center mt-4'>
                <div>
                  <button
                    style={{
                      border: 'none',
                      backgroundColor: '#e8e8e8',
                      borderRadius: '10px',
                      padding: '5px 20px',
                      marginRight: '10px',
                    }}
                    onClick={() => {
                      setIsOpen(false);
                      setIsUpdating(false);
                      setSelectedLovValue({
                        application_description: '',
                        application_id: null,
                        application_name: '',
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      if (formValue.form_id) {
                        updateFormValue(e);
                      } else {
                        insertFormValue(e);
                      }
                    }}
                    style={{
                      border: 'none',
                      backgroundColor: 'black',
                      color: 'white',
                      borderRadius: '10px',
                      padding: '5px 20px',
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div>
              <IoMdClose
                color='white'
                size={24}
                onClick={() => {
                  setIsOpen(false);
                  setIsUpdating(false);
                }}
              />
            </div>
          </div>
    
      </Modal>
      <Modal >
          <div className='d-flex'>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                width: '500px',
                padding: '20px',
              }}
            >
              <p className='fw-bold'>List Of Value Application</p>
              <VscSearch size={24} style={{ marginRight: '10px' }} />
              <input
                value={keyword}
                placeholder='Enter a keyword'
                onChange={(e) => {}}
              />
              <table className='table table-striped table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>No</th>
                    <th scope='col'>Application Name</th>
                    <th scope='col'>Application Description</th>
                  </tr>
                </thead>
                <tbody>
                  {lovData &&
                    lovData.map((lov, i) => (
                      <tr
                        style={{
                          backgroundColor:
                            selectedRowLov === lov.application_id ? 'pink' : '',
                        }}
                        key={lov.application_id}
                        onClick={() => {
                          setSelectedRowLov(lov.application_id);
                          setSelectedLovValue(lov);
                        }}
                      >
                        <th scope='row'>
                          {(pageNumberLov - 1) * pageSizeLov + (i + 1)}
                        </th>
                        <td>{lov.application_name}</td>
                        <td>{lov.application_description}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className='d-flex justify-content-center mt-4'>
                <div>
                  <button
                    onClick={() => {
                      setFormValue({
                        ...formValue,
                        application_id: selectedRowLov,
                      });
                      setOpenLov(false);
                    }}
                    style={{
                      border: 'none',
                      backgroundColor: 'black',
                      color: 'white',
                      borderRadius: '10px',
                      padding: '5px 20px',
                      marginRight: '10px',
                    }}
                  >
                    Select
                  </button>
                  <button
                    style={{
                      border: 'none',
                      backgroundColor: '#e8e8e8',
                      borderRadius: '10px',
                      padding: '5px 20px',
                    }}
                    onClick={() => {
                      setOpenLov(false);
                      setSelectedLovValue({
                        application_description: '',
                        application_id: null,
                        application_name: '',
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div>
              <IoMdClose
                color='white'
                size={24}
                onClick={() => {
                  setOpenLov(false);
                }}
              />
            </div>
          </div>
      
      </Modal>
      <Modal>
       
          <div
            style={{
              width: '500px',
              height: '200px',
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <p>Are you sure want to delete {formValue.form_name} ?</p>
            <div>
              <button
                onClick={() => setOpenDelete(false)}
                style={{
                  border: 'none',
                  backgroundColor: '#e8e8e8',
                  borderRadius: '10px',
                  padding: '5px 20px',
                  marginRight: '10px',
                  width: '100px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteFormValue()}
                style={{
                  border: 'none',
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '5px 20px',
                  width: '100px',
                }}
              >
                Yes
              </button>
            </div>
          </div>
      </Modal> */}
    </div>
  );
}
