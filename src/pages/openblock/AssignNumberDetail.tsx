import { useContext, useRef } from "react";
import md5 from "md5";
import moment from "moment";
import { FC, forwardRef, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { Lov } from "../../components/Lov";
import { FormIdContext } from "../../components/MainArea";
import { IModalProps, Modal } from "../../components/Modal";
import axios from "axios";
import { TableGrid } from "../../components/TableGrid";
import { useTableNavigation } from "../../utils/useTableNavigation";
import { InputLov } from "../../components/InputLov";
import { IOpenBlock } from "./OpenBlock";

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

interface IModalLovProps {
  title?: string;
  level?: number;
  width?: number;
  height?: number;
  open: boolean;
  close: () => void;
  children?: React.ReactNode;
  handleSelect?: () => void;
  handleClose?: () => void;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

export interface ILovArea {
  area_id: number;
  area_code: number;
  area_description: string;
}

export const initLovAreaData = {
  area_id: 0,
  area_code: 0,
  area_description: "",
};

const LovArea = ({
  open,
  close,
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  setSelectedLovRow: React.Dispatch<React.SetStateAction<ILovArea>>;
}) => {
  const formId = useContext(FormIdContext);
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
  const [data, setData] = useState<ILovArea[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/onselect_lov_area`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setData(response.data.Data);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize]);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/oncount_lov_area`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize]);

  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };
  const handleClose = () => {
    close();
  };
  const column = [{ column: "Area ID" },{ column: "Area Code" }, { column: "Area Description" }];
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );
  return (
    <Lov
      setKeyword={setKeyword}
      open={open}
      close={close}
      title="List of Area"
      level={3}
      handleClose={handleClose}
      handleSelect={handleSelect}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageNumber={setPageNumber}
      totalRecord={totalRecord}
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody ref={tableBodyRef}>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, data)}
                onClick={() => handleClick(data, i)}
                onDoubleClick={() => {
                  setSelectedLovRow(selectedRow);
                  close();
                }}
                tabIndex={i}
                style={{
                  backgroundColor:
                    selectedRow.area_code === d.area_code ? "#d8d8d8" : "",
                }}
              >
                <td>{d.area_id}</td>
                <td>{d.area_code}</td>
                <td>{d.area_description}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

interface ILovRegional {
  regional_id: number;
  regional_code: number;
  regional_description: string;
}

const initLovRegionalData = {
  regional_id: 0,
  regional_code: 0,
  regional_description: "",
};

const LovRegional = ({
  open,
  close,
  selectedLovAreaRow,
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  selectedLovAreaRow: ILovArea;
  setSelectedLovRow: React.Dispatch<React.SetStateAction<ILovRegional>>;
}) => {
  const formId = useContext(FormIdContext);
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
  const [data, setData] = useState<ILovRegional[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/onselect_lov_regional`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              area_id: selectedLovAreaRow.area_id | 0,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setData(response.data.Data);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize, selectedLovAreaRow.area_id]);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/oncount_lov_regional`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              area_id: selectedLovAreaRow.area_id | 0,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize, selectedLovAreaRow.area_id]);

  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };
  const handleClose = () => {
    close();
  };
  const column = [
    { column: "Regional ID" },
    { column: "Regional Code" },
    { column: "Regional Description" },
  ];
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );
  return (
    <Lov
      setKeyword={setKeyword}
      open={open}
      close={close}
      title="List of Regional"
      level={3}
      handleClose={handleClose}
      handleSelect={handleSelect}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageNumber={setPageNumber}
      totalRecord={totalRecord}
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody ref={tableBodyRef}>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, data)}
                onClick={() => handleClick(data, i)}
                onDoubleClick={() => {
                  setSelectedLovRow(selectedRow);
                  close();
                }}
                tabIndex={i}
                style={{
                  backgroundColor:
                    selectedRow.regional_code === d.regional_code
                      ? "#d8d8d8"
                      : "",
                }}
              >
                 <td>{d.regional_id}</td>
                <td>{d.regional_code}</td>
                <td>{d.regional_description}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

interface ILovPoc {
  poc_id: number;
  poc_code: number;
  poc_description: string;
}

const initLovPocData = {
  poc_id: 0,
  poc_code: 0,
  poc_description: "",
};

const LovPoc = ({
  open,
  close,
  selectedLovAreaRow,
  selectedLovRegionalRow,
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  selectedLovAreaRow: ILovArea;
  selectedLovRegionalRow: ILovRegional;
  setSelectedLovRow: React.Dispatch<React.SetStateAction<ILovPoc>>;
}) => {
  const formId = useContext(FormIdContext);
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
  const [data, setData] = useState<ILovPoc[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/onselect_lov_poc`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              area_id: selectedLovAreaRow.area_id | 0,
              regional_id: selectedLovRegionalRow.regional_id | 0,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setData(response.data.Data);
      })
      .catch((error) => console.log(error));
  }, [
    keyword,
    pageNumber,
    pageSize,
    selectedLovAreaRow.area_id,
    selectedLovRegionalRow.regional_id,
  ]);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/oncount_lov_poc`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              area_id: selectedLovAreaRow.area_id | 0,
              regional_id: selectedLovRegionalRow.regional_id | 0,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => console.log(error));
  }, [
    keyword,
    pageNumber,
    pageSize,
    selectedLovAreaRow.area_id,
    selectedLovRegionalRow.regional_id,
  ]);

  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };
  const handleClose = () => {
    close();
  };
  const column = [{ column: "Poc ID" }, { column: "Poc Code" }, { column: "Poc Description" }];
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );
  return (
    <Lov
      setKeyword={setKeyword}
      open={open}
      close={close}
      title="List of POC"
      level={3}
      handleClose={handleClose}
      handleSelect={handleSelect}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageNumber={setPageNumber}
      totalRecord={totalRecord}
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody ref={tableBodyRef}>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, data)}
                onClick={() => handleClick(data, i)}
                onDoubleClick={() => {
                  setSelectedLovRow(selectedRow);
                  close();
                }}
                tabIndex={i}
                style={{
                  backgroundColor:
                    selectedRow.poc_code === d.poc_code ? "#d8d8d8" : "",
                }}
              >
                  <td>{d.poc_id}</td>
                <td>{d.poc_code}</td>
                <td>{d.poc_description}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

interface ILovProduct {
  item_id: number;
  item_code: string;
  item_description: string;
  product_id: number;
  product_code: string;
  product_description: string;
}

const initLovProductData = {
  item_id: 0,
  item_code: "",
  item_description: "",
  product_id: 0,
  product_code: "",
  product_description: "",
};

const LovProduct = ({
  open,
  close,
  selectedLovAreaRow,
  selectedLovRegionalRow,
  selectedLovPocRow,
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  selectedLovAreaRow: ILovArea;
  selectedLovRegionalRow: ILovRegional;
  selectedLovPocRow: ILovPoc;
  setSelectedLovRow: React.Dispatch<React.SetStateAction<ILovProduct>>;
}) => {
  const formId = useContext(FormIdContext);
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
  const [data, setData] = useState<ILovProduct[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/onselect_lov_product`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              area_id: selectedLovAreaRow.area_id | 0,
              regional_id: selectedLovRegionalRow.regional_id | 0,
              poc_id: selectedLovPocRow.poc_id | 0,
              subscriber_type: 0, //hardcoded
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setData(response.data.Data);
      })
      .catch((error) => console.log(error));
  }, [
    keyword,
    pageNumber,
    pageSize,
    selectedLovAreaRow.area_id,
    selectedLovRegionalRow.regional_id,
    selectedLovPocRow.poc_id,
  ]);
  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/oncount_lov_product`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              area_id: selectedLovAreaRow.area_id | 0,
              regional_id: selectedLovRegionalRow.regional_id | 0,
              poc_id: selectedLovPocRow.poc_id | 0,
              subscriber_type: 0, //hardcoded
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => console.log(error));
  }, [
    keyword,
    pageNumber,
    pageSize,
    selectedLovAreaRow.area_id,
    selectedLovRegionalRow.regional_id,
    selectedLovPocRow.poc_id,
  ]);

  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };
  const handleClose = () => {
    close();
  };
  const column = [
    { column: "Item ID" },
    { column: "Item Code" },
    { column: "Item Description" },
    { column: "Product ID" },
    { column: "Product Code" },
    { column: "Product Description" },
  ];
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );
  return (
    <Lov
      setKeyword={setKeyword}
      open={open}
      close={close}
      title="List of Products"
      level={3}
      handleClose={handleClose}
      handleSelect={handleSelect}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageNumber={setPageNumber}
      totalRecord={totalRecord}
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody ref={tableBodyRef}>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, data)}
                onClick={() => handleClick(data, i)}
                onDoubleClick={() => {
                  setSelectedLovRow(selectedRow);
                  close();
                }}
                tabIndex={i}
                style={{
                  backgroundColor:
                    selectedRow.product_id === d.product_id ? "#d8d8d8" : "",
                }}
              >  <td>{d.item_id}</td>
                <td>{d.item_code}</td>
                <td>{d.item_description}</td>
                <td>{d.product_id}</td>
                <td>{d.product_code}</td>
                <td>{d.product_description}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

interface ILovGroupPattern {
  id: number;
  group_pattern_name: string;
  group_pattern_description: string;
  length_digit: number;
}

const initLovGroupPatternData = {
  id: 0,
  group_pattern_name: "",
  group_pattern_description: "",
  length_digit: 0,
};

const LovGroupPattern = ({
  open,
  close,
  selectedLovProductRow,
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  selectedLovProductRow: ILovProduct;
  setSelectedLovRow: React.Dispatch<React.SetStateAction<ILovGroupPattern>>;
}) => {
  const formId = useContext(FormIdContext);
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
  const [data, setData] = useState<ILovGroupPattern[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/onselect_lov_group_pattern`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              product_id: selectedLovProductRow.product_id,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setData(response.data.Data);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize, selectedLovProductRow.product_id]);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/oncount_lov_group_pattern`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              product_id: selectedLovProductRow.product_id | 0,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setTotalRecord(response.data.total_record);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize, selectedLovProductRow.product_id]);

  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };
  const handleClose = () => {
    close();
  };
  const column = [
    { column: "Group Pattern Name" },
    { column: "Group Description" },
    { column: "Length Digit" },
  ];
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );
  return (
    <Lov
      setKeyword={setKeyword}
      open={open}
      close={close}
      title="List of Group Pattern"
      level={3}
      handleClose={handleClose}
      handleSelect={handleSelect}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageNumber={setPageNumber}
      totalRecord={totalRecord}
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody ref={tableBodyRef}>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, data)}
                onClick={() => handleClick(data, i)}
                onDoubleClick={() => {
                  setSelectedLovRow(selectedRow);
                  close();
                }}
                tabIndex={i}
                style={{
                  backgroundColor:
                    selectedRow.group_pattern_name === d.group_pattern_name
                      ? "#d8d8d8"
                      : "",
                }}
              >
                <td>{d.group_pattern_name}</td>
                <td>{d.group_pattern_description}</td>
                <td>{d.length_digit}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

interface ILovNdc {
  ndc_id: number;
  ndc_code: string;
  ndc_description: string;
}

const initLovNdcData = {
  ndc_id: 0,
  ndc_code: "",
  ndc_description: "",
};

const LovNdc = ({
  open,
  close,
  selectedLovAreaRow,
  selectedLovRegionalRow,
  selectedLovPocRow,
  selectedLovProductRow,
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  selectedLovAreaRow: ILovArea;
  selectedLovRegionalRow: ILovRegional;
  selectedLovPocRow: ILovPoc;
  selectedLovProductRow: ILovProduct;
  setSelectedLovRow: React.Dispatch<React.SetStateAction<ILovNdc>>;
}) => {
  const formId = useContext(FormIdContext);
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
  const [data, setData] = useState<ILovNdc[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/onselect_lov_ndc`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              area_id: selectedLovAreaRow.area_id ,
              regional_id: selectedLovRegionalRow.regional_id ,
              poc_id: selectedLovPocRow.poc_id,
              product_id: selectedLovProductRow.product_id,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setData(response.data.Data);
      })
      .catch((error) => console.log(error));

      console.log(selectedLovAreaRow.area_id,
        selectedLovRegionalRow.regional_id,
       selectedLovPocRow.poc_id,
        selectedLovProductRow.product_id)
  }, [keyword, pageNumber, pageSize, selectedLovProductRow.product_id]);

  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };
  const handleClose = () => {
    close();
  };
  const column = [{ column: "Ndc Code" }, { column: "Ndc Description" }];
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );
  return (
    <Lov
      setKeyword={setKeyword}
      open={open}
      close={close}
      title="List of NDC"
      level={3}
      handleClose={handleClose}
      handleSelect={handleSelect}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageNumber={setPageNumber}
      totalRecord={totalRecord}
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody ref={tableBodyRef}>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, data)}
                onClick={() => handleClick(data, i)}
                onDoubleClick={() => {
                  setSelectedLovRow(selectedRow);
                  close();
                }}
                tabIndex={i}
                style={{
                  backgroundColor:
                    selectedRow.ndc_id === d.ndc_id ? "#d8d8d8" : "",
                }}
              >
                <td>{d.ndc_code}</td>
                <td>{d.ndc_description}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

interface ILovHlr {
  hlr_id: number;
  hlr_description: string;
}

const initLovHlrData = {
  hlr_id: 0,
  hlr_description: "",
};

const LovHlr = ({
  open,
  close,
  selectedLovAreaRow,
  selectedLovRegionalRow,
  selectedLovPocRow,
  selectedLovProductRow,
  selectedLovNdcRow,
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  selectedLovAreaRow: ILovArea;
  selectedLovRegionalRow: ILovRegional;
  selectedLovPocRow: ILovPoc;
  selectedLovProductRow: ILovProduct;
  selectedLovNdcRow: ILovNdc;
  setSelectedLovRow: React.Dispatch<React.SetStateAction<ILovHlr>>;
}) => {
  const formId = useContext(FormIdContext);
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
  const [data, setData] = useState<ILovHlr[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/onselect_lov_hlr`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              area_id: selectedLovAreaRow.area_id | 0,
              regional_id: selectedLovRegionalRow.regional_id | 0,
              poc_id: selectedLovPocRow.poc_id | 0,
              product_id: selectedLovProductRow.product_id | 0,
              ndc_id: selectedLovNdcRow.ndc_id | 0,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setData(response.data.Data);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize, selectedLovProductRow.product_id]);

  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };
  const handleClose = () => {
    close();
  };
  const column = [{ column: "Hlr ID" }, { column: "Hlr Description" }];
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );
  return (
    <Lov
      setKeyword={setKeyword}
      open={open}
      close={close}
      title="List of HLR"
      level={3}
      handleClose={handleClose}
      handleSelect={handleSelect}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageNumber={setPageNumber}
      totalRecord={totalRecord}
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody ref={tableBodyRef}>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, data)}
                onClick={() => handleClick(data, i)}
                onDoubleClick={() => {
                  setSelectedLovRow(selectedRow);
                  close();
                }}
                tabIndex={i}
                style={{
                  backgroundColor:
                    selectedRow.hlr_id === d.hlr_id ? "#d8d8d8" : "",
                }}
              >
                <td>{d.hlr_id}</td>
                <td>{d.hlr_description}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

interface ILovPrefix {
  ndc_description: string;
  hlr_description: string;
  prefix: number;
  length_digit: number;
  last_serial: string;
}

const initLovPrefixData = {
  ndc_description: "",
  hlr_description: "",
  prefix: 0,
  length_digit: 0,
  last_serial: "",
};

const LovPrefix = ({
  open,
  close,
  selectedLovAreaRow,
  selectedLovRegionalRow,
  selectedLovPocRow,
  selectedLovProductRow,
  selectedLovNdcRow,
  selectedLovHlrRow,
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  selectedLovAreaRow: ILovArea;
  selectedLovRegionalRow: ILovRegional;
  selectedLovPocRow: ILovPoc;
  selectedLovProductRow: ILovProduct;
  selectedLovNdcRow: ILovNdc;
  selectedLovHlrRow: ILovHlr;
  setSelectedLovRow: React.Dispatch<React.SetStateAction<ILovPrefix>>;
}) => {
  const formId = useContext(FormIdContext);
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
  const [data, setData] = useState<ILovPrefix[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/onselect_lov_prefix`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
    );
    // request.Validation.CompanyId, request.Validation.ResponsibilityId, request.Validation.UserId, request.Validation.GroupFunctionId, request.Validation.FunctionName, request.Validation.TimeStamp, secretkey)
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
              area_id: selectedLovAreaRow.area_id | 0,
              regional_id: selectedLovRegionalRow.regional_id | 0,
              poc_id: selectedLovPocRow.poc_id | 0,
              product_id: selectedLovProductRow.product_id | 0,
              ndc_id: selectedLovNdcRow.ndc_id | 0,
              hlr_id: selectedLovHlrRow.hlr_id | 0,
              keyword: `${keyword}%`,
              pageNumber,
              pageSize,
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
        console.log(response.data);
        setData(response.data.Data);
      })
      .catch((error) => console.log(error));
  }, [keyword, pageNumber, pageSize, selectedLovProductRow.product_id]);

  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };
  const handleClose = () => {
    close();
  };
  const column = [
    { column: "Ndc Description" },
    { column: "Hlr Description" },
    { column: "Prefix" },
    { column: "Length Digit" },
    { column: "Last Serial" },
  ];
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );
  return (
    <Lov
      setKeyword={setKeyword}
      open={open}
      close={close}
      title="List of Prefix"
      level={3}
      handleClose={handleClose}
      handleSelect={handleSelect}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageNumber={setPageNumber}
      totalRecord={totalRecord}
    >
      <TableGrid column={column} heightPercentage={90}>
        <tbody ref={tableBodyRef}>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, data)}
                onClick={() => handleClick(data, i)}
                onDoubleClick={() => {
                  setSelectedLovRow(selectedRow);
                  close();
                }}
                tabIndex={i}
                style={{
                  backgroundColor:
                    selectedRow.prefix === d.prefix ? "#d8d8d8" : "",
                }}
              >
                <td>{d.ndc_description}</td>
                <td>{d.hlr_description}</td>
                <td>{d.prefix}</td>
                <td>{d.length_digit}</td>
                <td>{d.last_serial}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
    </Lov>
  );
};

interface IAssignNumberDetail{ 
  open: boolean;
  close: () => void;
  selectedRowOpenBlock?: IOpenBlock;
}
export const AssignNumberDetail = ({
  open,
  close,
  selectedRowOpenBlock
}: IAssignNumberDetail) => {

  const formId = useContext(FormIdContext);
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
  const [type, setType] = useState("-1");

  const [openLovArea, setOpenLovArea] = useState(false);
  const [openLovRegional, setOpenLovRegional] = useState(false);
  const [openLovPoc, setOpenLovPoc] = useState(false);
  const [openLovProduct, setOpenLovProduct] = useState(false);
  const [openLovGroupPattern, setOpenLovGroupPattern] = useState(false);
  const [openLovNdc, setOpenLovNdc] = useState(false);
  const [openLovHlr, setOpenLovHlr] = useState(false);
  const [openLovPrefix, setOpenLovPrefix] = useState(false);

  const [selectedLovAreaRow, setSelectedLovAreaRow] =
    useState<ILovArea>(initLovAreaData);
  const [selectedLovRegionalRow, setSelectedLovRegionalRow] =
    useState<ILovRegional>(initLovRegionalData);
  const [selectedLovPocRow, setSelectedLovPocRow] =
    useState<ILovPoc>(initLovPocData);
  const [selectedLovProductRow, setSelectedLovProductRow] =
    useState<ILovProduct>(initLovProductData);
  const [selectedLovGroupPatternRow, setSelectedLovGroupPatternRow] =
    useState<ILovGroupPattern>(initLovGroupPatternData);
  const [selectedLovNdcRow, setSelectedLovNdcRow] =
    useState<ILovNdc>(initLovNdcData);
  const [selectedLovHlrRow, setSelectedLovHlrRow] =
    useState<ILovHlr>(initLovHlrData);
  const [selectedLovPrefixRow, setSelectedLovPrefixRow] =
    useState<ILovPrefix>(initLovPrefixData);

    const handleReset = () => {
      setSelectedLovAreaRow(initLovAreaData);
      setSelectedLovRegionalRow(initLovRegionalData);
      setSelectedLovPocRow(initLovPocData);
      setSelectedLovProductRow(initLovProductData);
      setSelectedLovGroupPatternRow(initLovGroupPatternData);
      setSelectedLovNdcRow(initLovNdcData);
      setSelectedLovHlrRow(initLovHlrData);
      setSelectedLovPrefixRow(initLovPrefixData);
    }

    const handleSubmitByRange = () => {
    const functionName = "INSERT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm611t/oninsert_by_range`;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const { responsibility_id, group_function_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${user.company_id}${responsibility_id}${user.user_id}${group_function_id}${functionName}${timestamp}${secretKey}`
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
            area_id: selectedLovAreaRow.area_id | 0,
            regional_id: selectedLovRegionalRow.regional_id | 0,
            poc_id: selectedLovPocRow.poc_id | 0,
            open_block_id: 1,
            new_block_type: 1,
            item_id: selectedLovProductRow.item_id | 0,
            product_id: selectedLovProductRow.product_id | 0,
            from_ndc_id: selectedLovNdcRow.ndc_id | 0,
            from_hlr_id: selectedLovHlrRow.hlr_id | 0,
            from_prefix: selectedLovPrefixRow.prefix | 0,
            from_serial: selectedLovPrefixRow.last_serial,
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
      console.log(response.data);

    })
    .catch((error) => console.log(error));
    }

  return (
    <>
      <Modal open={open} close={close} title="Open New Block" level={2}>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              padding: "1rem",
              border: "1px solid #e8e8e8",
            }}
          >
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "100px",
                  textAlign: "right",
                  marginRight: "5px",
                }}
              >
                Type:
              </div>
              <div>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="-1"></option>
                  <option value="0">LAST SERIAL</option>
                  <option value="1">RANGE</option>
                  <option value="2">ADD LIST</option>
                  <option value="3">FILE UPLOAD</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex",}}>
              <div>
               
              <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "100px",
                      textAlign: "right",
                      marginRight: "5px",
                    }}
                  >
                    Area:
                  </div>
                  <div>
                    <InputLov
                      value={selectedLovAreaRow.area_description}
                      btnOnClick={() => setOpenLovArea(true)}
                    />
                  </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "100px",
                        textAlign: "right",
                        marginRight: "5px",
                      }}
                    >
                      Region:
                    </div>
                    <div>
                      <InputLov
                        value={selectedLovRegionalRow.regional_description}
                        btnOnClick={() => setOpenLovRegional(true)}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "100px",
                        textAlign: "right",
                        marginRight: "5px",
                      }}
                    >
                      POC:
                    </div>
                    <div>
                      <InputLov
                        btnOnClick={() => setOpenLovPoc(true)}
                        value={selectedLovPocRow.poc_description}
                      />
                    </div>
                  </div>
              
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "120px",
                      textAlign: "right",
                      marginRight: "5px",
                    }}
                  >
                    Product:
                  </div>
                  <div>
                    <InputLov
                      value={selectedLovProductRow.product_description}
                      btnOnClick={() => setOpenLovProduct(true)}
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "120px",
                      textAlign: "right",
                      marginRight: "5px",
                    }}
                  >
                    Item:
                  </div>
                  <div>
                    <input
                      value={selectedLovProductRow.item_description}
                      readOnly
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "120px",
                      textAlign: "right",
                      marginRight: "5px",
                    }}
                  >
                    Group Pattern:
                  </div>
                  <div>
                    <InputLov
                      value={selectedLovGroupPatternRow.group_pattern_name}
                      btnOnClick={() => setOpenLovGroupPattern(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {type === "0" && (
            <div
              style={{
                padding: "1rem",
                border: "1px solid #e8e8e8",
              }}
            >
              <div style={{ display: "flex" }}>
                <div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "100px",
                        textAlign: "right",
                        marginRight: "5px",
                      }}
                    >
                      NDC:
                    </div>
                    <div>
                      <InputLov value={selectedLovNdcRow.ndc_id.toString()} btnOnClick={() => setOpenLovNdc(true)} />
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "100px",
                        textAlign: "right",
                        marginRight: "5px",
                      }}
                    >
                      HLR:
                    </div>
                    <div>
                      <InputLov value={selectedLovHlrRow.hlr_id.toString()} btnOnClick={() => setOpenLovHlr(true)}/>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "100px",
                        textAlign: "right",
                        marginRight: "5px",
                      }}
                    >
                      Prefix:
                    </div>
                    <div>
                      <InputLov />
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "120px",
                        textAlign: "right",
                        marginRight: "5px",
                      }}
                    >
                      Quantity:
                    </div>
                    <div>
                      <input />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {type === "1" && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1rem",
                border: "1px solid #e8e8e8",
                marginTop: "10px",
              }}
            >
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100px", textAlign: "right" }}>
                    From NDC:
                  </div>
                  <InputLov
                    value={selectedLovNdcRow.ndc_description}
                    btnOnClick={() => setOpenLovNdc(true)}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100px", textAlign: "right" }}>
                    To NDC:
                  </div>
                  <input style={{ width: "120px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100px", textAlign: "right" }}>HLR:</div>
                  <InputLov
                    value={selectedLovHlrRow.hlr_description}
                    btnOnClick={() => setOpenLovHlr(true)}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100px", textAlign: "right" }}>HLR:</div>
                  <input style={{ width: "100px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100px", textAlign: "right" }}>
                    Prefix:
                  </div>
                  <InputLov
                    value={selectedLovPrefixRow.prefix.toString()}
                    btnOnClick={() => setOpenLovPrefix(true)}
                  />
                </div>

                <div style={{ display: "flex" }}>
                  <div style={{ width: "100px", textAlign: "right" }}>
                    Prefix:
                  </div>
                  <input style={{ width: "100px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100px", textAlign: "right" }}>
                    Sequence:
                  </div>
                  <input style={{ width: "100px" }} />
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100px", textAlign: "right" }}>
                    Sequence:
                  </div>
                  <input style={{ width: "100px" }} />
                </div>
              </div>
            </div>
          )}
          {type === "2" && (
            <div
              style={{
                padding: "1rem",
                border: "1px solid #e8e8e8",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "100px",
                        textAlign: "right",
                        marginRight: "5px",
                      }}
                    >
                      MSISDN:
                    </div>
                    <div>
                      <input />
                      <button>Add</button>
                      <button>clear</button>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "100px",
                      textAlign: "right",
                      marginRight: "5px",
                    }}
                  ></div>
                  <div>
                    <textarea style={{ width: "300px" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {type === "3" && (
            <div
              style={{
                padding: "1rem",
                border: "1px solid #e8e8e8",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "100px",
                        textAlign: "right",
                        marginRight: "5px",
                      }}
                    >
                      MSISDN:
                    </div>
                    <div>
                      <input type="file" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <div>
              <button className="secondary-btn btn-left" onClick={() => {close(); handleReset()}}>Close</button>
              <button className="primary-btn">Submit</button>
            </div>
          </div>
        </div>
      </Modal>
      <LovArea
        open={openLovArea}
        close={() => setOpenLovArea(false)}
        setSelectedLovRow={setSelectedLovAreaRow}
      />
      <LovRegional
        open={openLovRegional}
        close={() => setOpenLovRegional(false)}
        selectedLovAreaRow={selectedLovAreaRow}
        setSelectedLovRow={setSelectedLovRegionalRow}
      />
      <LovPoc
        open={openLovPoc}
        close={() => setOpenLovPoc(false)}
        selectedLovAreaRow={selectedLovAreaRow}
        selectedLovRegionalRow={selectedLovRegionalRow}
        setSelectedLovRow={setSelectedLovPocRow}
      />
      <LovProduct
        open={openLovProduct}
        close={() => setOpenLovProduct(false)}
        selectedLovAreaRow={selectedLovAreaRow}
        selectedLovRegionalRow={selectedLovRegionalRow}
        selectedLovPocRow={selectedLovPocRow}
        setSelectedLovRow={setSelectedLovProductRow}
      />
      <LovGroupPattern
        open={openLovGroupPattern}
        close={() => setOpenLovGroupPattern(false)}
        selectedLovProductRow={selectedLovProductRow}
        setSelectedLovRow={setSelectedLovGroupPatternRow}
      />
      <LovNdc
        open={openLovNdc}
        close={() => setOpenLovNdc(false)}
        selectedLovAreaRow={selectedLovAreaRow}
        selectedLovRegionalRow={selectedLovRegionalRow}
        selectedLovPocRow={selectedLovPocRow}
        selectedLovProductRow={selectedLovProductRow}
        setSelectedLovRow={setSelectedLovNdcRow}
      />
      <LovHlr
        open={openLovHlr}
        close={() => setOpenLovHlr(false)}
        selectedLovAreaRow={selectedLovAreaRow}
        selectedLovRegionalRow={selectedLovRegionalRow}
        selectedLovPocRow={selectedLovPocRow}
        selectedLovProductRow={selectedLovProductRow}
        selectedLovNdcRow={selectedLovNdcRow}
        setSelectedLovRow={setSelectedLovHlrRow}
      />
      <LovPrefix
        open={openLovPrefix}
        close={() => setOpenLovPrefix(false)}
        selectedLovAreaRow={selectedLovAreaRow}
        selectedLovRegionalRow={selectedLovRegionalRow}
        selectedLovPocRow={selectedLovPocRow}
        selectedLovProductRow={selectedLovProductRow}
        selectedLovNdcRow={selectedLovNdcRow}
        selectedLovHlrRow={selectedLovHlrRow}
        setSelectedLovRow={setSelectedLovPrefixRow}
      />
    </>
  );
};
