import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import {Modal} from '../components/Modal';
import Navbar from '../components/Navbar';
import moment from 'moment';
import axios from 'axios';
import md5 from 'md5';
import { VscSearch } from 'react-icons/vsc';
import NewSidebar from '../components/NewSidebar';
import { Paging } from '../components/Paging';
import { TableGrid } from '../components/TableGrid';

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

interface TabList {
  key: number;
  id: number;
  component: string;
  formId: number;
}

interface Responsibilities {
  application_id: number | null;
  group_function_id: number | null;
  menu_id: number | null;
  responsibility_description: string;
  responsibility_id: number | null;
  responsibility_name: string;
}

export const AppCtx = React.createContext<
  [
    TabList[],
    React.Dispatch<React.SetStateAction<TabList[]>>,
    number,
    React.Dispatch<React.SetStateAction<number>>
  ]
>({} as any);

export const ThemeCtx = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>({} as any);

export default function Home() {
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
  const [responsibilities, setResponsibilities] = useState<Responsibilities[]>(
    []
  );

  const storedResponsibility = localStorage.getItem('responsibility');
  const persistedResponsibility = storedResponsibility
    ? JSON.parse(storedResponsibility)
    : {
        application_id: null,
        group_function_id: null,
        menu_id: null,
        responsibility_description: '',
        responsibility_id: null,
        responsibility_name: '',
      };

  const [responsibility, setResponsibility] = useState<Responsibilities>(
    persistedResponsibility
  );

  const menuNotLoaded = localStorage.getItem('menu_not_loaded');
  const stroredMenuNotLoaded = menuNotLoaded ? JSON.parse(menuNotLoaded) : true;

  const [darkMode, setDarkMode] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isOpen, setIsOpen] = useState(stroredMenuNotLoaded);
  const [isLoading, setIsLoading] = useState(false);
  const [LoadingMenu, setLoadingMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tabList, setTabList] = useState<TabList[]>([
    { key: 0, id: 0, component: 'homeIndex', formId: 0 },
  ]);

  const storedMenuData = localStorage.getItem('menu_data');
  const persistedMenuData = storedMenuData ? JSON.parse(storedMenuData) : [];
  const [menuData, setMenuData] = useState(persistedMenuData);
  const [responsibilityId, setResponsibilityId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const getMenu = (responsibilityId: number | null, menuId: number | null) => {
    setLoadingMenu(true);
    let timestamp = moment().format('YYYYMMDDHHmmss');
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem('responsibility') || 'null'
    );
    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibilityId}${menuId}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/users/ongetmenu`;
    axios
      .post(
        url,
        {
          Validation: {
            timestamp: timestamp,
            company_id: user.company_id,
            user_id: user.user_id,
            responsibility_id: responsibilityId,
            group_function_id: group_function_id,
            form_id: 1,
            function_name: 'SELECT_ALLOWED',
            session: user.session,
            bu_id: 0,
          },
          Parameters: {
            menu_id: menuId,
          },
        },
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            clientsignature: md5hash,
            apikey: apiKey,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        localStorage.setItem('menu_data', JSON.stringify(response.data.Data));
        localStorage.setItem('menu_not_loaded', JSON.stringify(false));

        setMenuData(response.data.Data);
        setIsOpen(false);
        setLoadingMenu(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingMenu(false);
      });
    setTabList(tabList.splice(0, 1));
    setActiveTab(0);
  };

  const getListOfResponsibilities = useCallback(() => {
    setIsLoading(true);
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const md5hash = md5(
      `${user.company_id}${user.user_id}${keyword}%${pageNumber}${pageSize}${timestamp}${secretKey}`
    );
    const url = `${baseURL}/prn/fnd/users/onselectresponsibility`;
    axios
      .post(
        url,
        {
          Validation: {
            timestamp: timestamp,
            company_id: user.company_id,
            user_id: user.user_id,
            responsibility_id: 0,
            group_function_id: 0,
            form_id: 1,
            function_name: 'SELECT_ALLOWED',
            session: user.session,
            bu_id: 0,
          },
          Parameters: {
            ParamQuery: {
              keyword: `${keyword}%`,
              pageNumber: pageNumber,
              pageSize: pageSize,
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
        setIsLoading(false);
        if (response.data.status === 1) {
          setErrorMessage(response.data.message);
        }
        setResponsibilities(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [keyword, pageNumber, pageSize, user.company_id, user.user_id]);

  const countResponsibilities = useCallback(() => {
    setIsLoading(true);
    let timestamp = moment().format('YYYYMMDDHHmmss');
    let md5hash = md5(
      `${user.company_id}${user.user_id}${keyword}%${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/users/oncountresponsibility`;

    axios
      .post(
        url,
        {
          Validation: {
            timestamp: timestamp,
            company_id: user.company_id,
            user_id: user.user_id,
            responsibility_id: 0,
            group_function_id: 0,
            form_id: 1,
            function_name: 'SELECT_ALLOWED',
            session: user.session,
            bu_id: 0,
          },
          Parameters: {
            ParamQuery: {
              keyword: `${keyword}%`,
              pageNumber: pageNumber,
              pageSize: pageSize,
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
      .catch((error) => {
        console.log(error);
      });
  }, [keyword, user.company_id, user.user_id]);

  useEffect(() => {
    getListOfResponsibilities();
  }, [pageNumber, getListOfResponsibilities]);

  useEffect(() => {
    countResponsibilities();
  }, [countResponsibilities]);

  useEffect(() => {
    localStorage.setItem('responsibility', JSON.stringify(responsibility));
  }, [responsibility]);

  const column = [{ column: 'Responsibility' }, { column: 'Description' }];

  const [showSideNav, setShowSideNav] = useState(false);

  return (
    <>
      <AppCtx.Provider value={[tabList, setTabList, activeTab, setActiveTab]}>
        <ThemeCtx.Provider value={[darkMode, setDarkMode]}>
          <Navbar
            {...user}
            open={() => setIsOpen(true)}
            toggleSideNav={() => setShowSideNav(!showSideNav)}
          />
          <NewSidebar menuData={menuData} showSideNav={showSideNav} />
          <Modal open={isOpen} close={() => setIsOpen(false)} title='List Of Responsibilities'>
            <div
            >
              {isLoading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Loader />
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setKeyword(searchQuery);
                      }}
                    >
                      <button type='submit' className='btn-no-style'>
                        <VscSearch size={24} style={{ marginRight: '10px' }} />
                      </button>
                      <input
                        value={searchQuery}
                        placeholder='Enter a keyword'
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type='search'
                      />
                    </form>
                  </div>

                  <TableGrid column={column} heightPercentage={90}>
                    {responsibilities &&
                      responsibilities.map((r, i) => (
                        <tr
                          key={r.responsibility_id}
                          onDoubleClick={() => {
                            getMenu(r.responsibility_id, r.menu_id);
                            setResponsibilityId(r.responsibility_id);
                            setMenuId(r.menu_id);
                            setResponsibility(r);
                          }}
                          onClick={() => {
                            setSelectedRow(r.responsibility_id);
                            setResponsibilityId(r.responsibility_id);
                            setMenuId(r.menu_id);
                            setResponsibility(r);
                          }}
                          style={{
                            backgroundColor: selectedRow === r.responsibility_id
                              ? 'pink'
                              : '',
                          }}
                        >
                          <td
                            style={{
                              backgroundColor:  selectedRow === r.responsibility_id
                                ? 'pink'
                                : '',
                            }}
                          >
                            {r.responsibility_name}
                          </td>
                          <td>{r.responsibility_description}</td>
                        </tr>
                      ))}
                  </TableGrid>

                  <Paging
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    totalRecord={totalRecord}
                    setPageNumber={setPageNumber}
                  />

                  <br />
                  <div style={{ display: 'flex' }}>
                    <button
                      onClick={() => setIsOpen(false)}
                      style={{
                        border: 'none',
                        backgroundColor: '#e8e8e8',
                        borderRadius: '10px',
                        padding: '5px 20px',
                        width: '100px',
                        marginRight: '10px',
                        height: '35px',
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={() => getMenu(responsibilityId, menuId)}
                      style={{
                        border: 'none',
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '5px 20px',
                        height: '35px',
                        width: '100px',
                      }}
                    >
                      {LoadingMenu ? <Loader /> : <>Select</>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </Modal>
        
        </ThemeCtx.Provider>
      </AppCtx.Provider>
    </>
  );
}
