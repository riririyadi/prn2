import React, { useCallback, useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { Modal } from "../components/Modal";
import Navbar from "../components/Navbar";
import moment from "moment";
import axios from "axios";
import md5 from "md5";
import { VscSearch } from "react-icons/vsc";
import NewSidebar from "../components/NewSidebar";
import { Paging } from "../components/Paging";
import { TableGrid } from "../components/TableGrid";
import { Lov } from "../components/Lov";

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

export interface BusinessUnit {
  bu_id: number;
  bu_code: string;
  bu_description: string;
}

export const initBusinessUnit = {
  bu_id: 0,
  bu_code: "",
  bu_description: "",
};

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

const LovResponsibility = ({
  open,
  setOpen,
  close,
  setMenuData,
  setBusinessUnit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
  setMenuData: React.Dispatch<any>;
  setBusinessUnit: React.Dispatch<React.SetStateAction<BusinessUnit>>;
}) => {
  const [tabList, setTabList, activeTab, setActiveTab] =
    React.useContext(AppCtx);
  const userData = localStorage.getItem("user_data");
  const persistedUserData = userData
    ? JSON.parse(userData)
    : {
        user_id: 0,
        user_description: "",
        company_id: 0,
        company_code: "",
        company_description: "",
        session: "",
      };

  const [user, setUser] = useState(persistedUserData);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");


  const [responsibilities, setResponsibilities] = useState<Responsibilities[]>(
    []
  );

  const storedResponsibility = localStorage.getItem("responsibility");
  const persistedResponsibility = storedResponsibility
    ? JSON.parse(storedResponsibility)
    : {
        application_id: null,
        group_function_id: null,
        menu_id: null,
        responsibility_description: "",
        responsibility_id: null,
        responsibility_name: "",
      };

  const [responsibility, setResponsibility] = useState<Responsibilities>(
    persistedResponsibility
  );

  const [menuId, setMenuId] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const getListOfResponsibilities = useCallback(() => {
    const timestamp = moment().format("YYYYMMDDHHmmss");
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
            function_name: "SELECT_ALLOWED",
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
            "Content-Type": "application/json",
            Accept: "application/json",
            apikey: apiKey,
            clientsignature: md5hash,
          },
        }
      )
      .then((response) => {
        console.log(response);
       
        if (response.data.Reply.status === 1) {
          setErrorMessage(response.data.message);
        }
        setResponsibilities(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [keyword, pageNumber, pageSize, user.company_id, user.user_id]);

  const countResponsibilities = useCallback(() => {
    let timestamp = moment().format("YYYYMMDDHHmmss");
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
            function_name: "SELECT_ALLOWED",
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
            "Content-Type": "application/json",
            Accept: "application/json",
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
    localStorage.setItem("responsibility", JSON.stringify(responsibility));
  }, [responsibility]);
  const column = [{ column: "Responsibility" }, { column: "Description" }];
  const getMenu = (responsibilityId: number | null, menuId: number | null) => {
    let timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
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
            function_name: "SELECT_ALLOWED",
            session: user.session,
            bu_id: 0,
          },
          Parameters: {
            menu_id: menuId,
          },
        },
        {
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
            clientsignature: md5hash,
            apikey: apiKey,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("menu_data", JSON.stringify(response.data.Data));
        localStorage.setItem("menu_not_loaded", JSON.stringify(false));

        setMenuData(response.data.Data);
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setTabList(tabList.splice(0, 1));
    
  };

  const [responsibilityId, setResponsibilityId] = useState<number | null>(null);
  return (
    <Lov
      open={open}
      close={close}
      setKeyword={setKeyword}
      setPageNumber={setPageNumber}
      pageSize={pageSize}
      pageNumber={pageNumber}
      totalRecord={totalRecord}
      title="List of Responsibilities"
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody>
          {responsibilities &&
            responsibilities.map((r, i) => (
              <tr
                key={r.responsibility_id}
                onDoubleClick={() => {
                  getMenu(r.responsibility_id, r.menu_id);
                  setResponsibilityId(r.responsibility_id);
                  setMenuId(r.menu_id);
                  setResponsibility(r);
                  setBusinessUnit(initBusinessUnit)
                  localStorage.setItem('business_unit',JSON.stringify(initBusinessUnit))
                }}
                onClick={() => {
                  setSelectedRow(r.responsibility_id);
                  setResponsibilityId(r.responsibility_id);
                  setMenuId(r.menu_id);
                  setResponsibility(r);
                }}
                style={{
                  backgroundColor:
                    selectedRow === r.responsibility_id ? "pink" : "",
                }}
              >
                <td
                  style={{
                    backgroundColor:
                      selectedRow === r.responsibility_id ? "pink" : "",
                  }}
                >
                  {r.responsibility_name}
                </td>
                <td>{r.responsibility_description}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

const LovBU = ({
  open,
  close,
  setBusinessUnit,
}: {
  open: boolean;
  close: () => void;
  setBusinessUnit: React.Dispatch<React.SetStateAction<BusinessUnit>>;
}) => {
  const userData = localStorage.getItem("user_data");
  const persistedUserData = userData
    ? JSON.parse(userData)
    : {
        user_id: 0,
        user_description: "",
        company_id: 0,
        company_code: "",
        company_description: "",
        session: "",
      };

  const [user, setUser] = useState(persistedUserData);
  const [data, setData] = useState<BusinessUnit[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    if (!open) return;
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/fnd/users/onselectbu`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );

    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${timestamp}${secretKey}`
    );

    axios
      .post(
        url,
        {
          Validation: {
            timestamp: timestamp,
            company_id: user.company_id,
            user_id: user.user_id,
            responsibility_id: responsibility_id,
            group_function_id: group_function_id,
            form_id: 1,
            function_name: functionName,
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
            "Content-Type": "application/json",
            Accept: "application/json",
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
  }, [keyword, pageNumber, pageSize, open]);

  useEffect(() => {
    if (!open) return;
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/fnd/users/oncountbu`;
    const timestamp = moment().format("YYYYMMDDHHmmss");

    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );

    let md5hash = md5(
      `${user.company_id}${user.user_id}${responsibility_id}${timestamp}${secretKey}`
    );

    axios
      .post(
        url,
        {
          Validation: {
            timestamp: timestamp,
            company_id: user.company_id,
            user_id: user.user_id,
            responsibility_id: responsibility_id,
            group_function_id: group_function_id,
            form_id: 1,
            function_name: functionName,
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
            "Content-Type": "application/json",
            Accept: "application/json",
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
  }, [keyword, pageNumber, pageSize, open]);

  const column = [{ column: "BU Code" }, { column: "BU Description" }];

  return (
    <Lov
      open={open}
      close={close}
      setKeyword={setKeyword}
      setPageNumber={setPageNumber}
      pageSize={pageSize}
      totalRecord={totalRecord}
      pageNumber={pageNumber}
      title="List of Business Units"
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                onDoubleClick={() => {
                  localStorage.setItem("business_unit", JSON.stringify(d));
                  setBusinessUnit(d);
                  close()
                }}
              >
                <td>{d.bu_code}</td>
                <td>{d.bu_description}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

export default function Home() {
  const userData = localStorage.getItem("user_data");
  const persistedUserData = userData
    ? JSON.parse(userData)
    : {
        user_id: 0,
        user_description: "",
        company_id: 0,
        company_code: "",
        company_description: "",
        session: "",
      };
  const [user, setUser] = useState(persistedUserData);

  const buData = localStorage.getItem("business_unit");
  const persistedBu = buData ? JSON.parse(buData) : initBusinessUnit;
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit>(persistedBu);

  const menuNotLoaded = localStorage.getItem("menu_not_loaded");
  const stroredMenuNotLoaded = menuNotLoaded ? JSON.parse(menuNotLoaded) : true;
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(stroredMenuNotLoaded);
  const [openBU, setOpenBU] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tabList, setTabList] = useState<TabList[]>([
    { key: 0, id: 0, component: "homeIndex", formId: 0 },
  ]);

  const storedMenuData = localStorage.getItem("menu_data");
  const persistedMenuData = storedMenuData ? JSON.parse(storedMenuData) : [];
  const [menuData, setMenuData] = useState(persistedMenuData);
  const [showSideNav, setShowSideNav] = useState(false);

  return (
    <>
      <AppCtx.Provider value={[tabList, setTabList, activeTab, setActiveTab]}>
        <ThemeCtx.Provider value={[darkMode, setDarkMode]}>
          <Navbar
            {...user}
            open={() => setOpen(true)}
            toggleSideNav={() => setShowSideNav(!showSideNav)}
            openBU={() => setOpenBU(true)}
            bu={businessUnit}
          />
          <NewSidebar menuData={menuData} showSideNav={showSideNav} />
          <LovResponsibility
            open={open}
            close={() => setOpen(false)}
            setOpen={setOpen}
            setMenuData={setMenuData}
            setBusinessUnit={setBusinessUnit}
          />
          <LovBU
            open={openBU}
            close={() => setOpenBU(false)}
            setBusinessUnit={setBusinessUnit}
          />
        </ThemeCtx.Provider>
      </AppCtx.Provider>
    </>
  );
}
