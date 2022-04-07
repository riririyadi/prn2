import React, { useContext, useEffect, useRef, useState } from "react";
import { TableGrid } from "../../components/TableGrid";
import { MenuBar } from "../../components/MenuBar";
import { Paging } from "../../components/Paging";
import { OpenNewBlock } from "./OpenNewBlock";
import { GrFilter } from "react-icons/gr";
import { Modal } from "../../components/Modal";
import { Lov } from "../../components/Lov";
import moment from "moment";
import { FormIdContext } from "../../components/MainArea";
import md5 from "md5";
import axios from "axios";
import { useTableNavigation } from "../../utils/useTableNavigation";
import { InputLov } from "../../components/InputLov";
import { BusinessUnit, initBusinessUnit } from "../Home";

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

const LovStatus = ({
  open,
  close,
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  setSelectedLovRow: React.Dispatch<
    React.SetStateAction<{
      status: number;
      status_name: string;
    }>
  >;
}) => {
  const formId = React.useContext(FormIdContext);
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
  const [data, setData] = useState([{ status: 0, status_name: "" }]);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm610t/onselect_lov_status`;
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

  const column = [{ column: "Status" }, { column: "Status Name" }];
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );

  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };

  const handleClose = () => {
    close();
  };

  return (
    <Lov
      open={open}
      close={close}
      title="List of Status"
      setKeyword={setKeyword}
      level={2}
      handleClose={handleClose}
      handleSelect={handleSelect}
      pageNumber={pageNumber}
      setPageNumber={setPageNumber}
      pageSize={pageSize}
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
                    selectedRow.status === d.status ? "#d8d8d8" : "",
                }}
              >
                <td>{d.status}</td>
                <td>{d.status_name}</td>
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
  setSelectedLovRow,
}: {
  open: boolean;
  close: () => void;
  setSelectedLovRow: React.Dispatch<
    React.SetStateAction<{
      bu_id: number;
      bu_code: string;
      bu_description: string;
    }>
  >;
}) => {
  const [keyword, setKeyword] = useState("");
  const [totalRecord, setTotalRecord] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleSelect = () => {
    setSelectedLovRow(selectedRow);
    close();
  };
  const handleClose = () => {
    close();
  };

  const dataBU = [
    { bu_id: "1", bu_code: "0001", bu_description: "Jakarta Barat" },
    { bu_id: "2", bu_code: "0003", bu_description: "Jakarta Selatan" },
  ];

  const column = [{ column: "BU Code" }, { column: "BU Description" }];

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );

  return (
    <Lov
      title="List Of Business Units"
      level={2}
      open={open}
      close={close}
      setKeyword={setKeyword}
      setPageNumber={setPageNumber}
      pageNumber={pageNumber}
      pageSize={pageSize}
      totalRecord={totalRecord}
      handleClose={handleClose}
      handleSelect={handleSelect}
    >
      <TableGrid column={column}>
        <tbody ref={tableBodyRef}>
          {dataBU &&
            dataBU.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, dataBU)}
                onClick={() => handleClick(dataBU, i)}
                onDoubleClick={() => {
                  setSelectedLovRow(selectedRow);
                  close();
                }}
                tabIndex={i}
                style={{
                  backgroundColor:
                    selectedRow.bu_code === d.bu_code ? "#d8d8d8" : "",
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

export interface IOpenBlock {
  approved_by: number;
  approved_by_name: string;
  approved_date: string;
  bu_code: string;
  bu_description: string;
  bu_id: number;
  cancelled_by: number;
  cancelled_by_name: string;
  cancelled_date: string;
  created_by: number;
  created_by_name: string;
  created_date: string;
  id: number;
  modified_by: number;
  modified_by_name: string;
  modified_date: string;
  open_block_date: string;
  open_block_number: string;
  remarks: string;
  status: number;
  status_name: string;
  submitted_by: number;
  submitted_by_name: string;
  submitted_date: string;
  subscriber_type: string;
  subscriber_type_name: string;
}

export const initOpenBlockData = {
  approved_by: 0,
  approved_by_name: "",
  approved_date: "",
  bu_code: "",
  bu_description: "",
  bu_id: 0,
  cancelled_by: 0,
  cancelled_by_name: "",
  cancelled_date: "",
  created_by: 0,
  created_by_name: "",
  created_date: "",
  id: 0,
  modified_by: 0,
  modified_by_name: "",
  modified_date: "",
  open_block_date: "",
  open_block_number: "",
  remarks: "",
  status: 0,
  status_name: "Draft",
  submitted_by: 0,
  submitted_by_name: "",
  submitted_date: "",
  subscriber_type: "-1",
  subscriber_type_name: "",
};

export default function OpenBlock() {
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
  const formId = useContext(FormIdContext);

  const column = [
    { column: "BU Code" },
    { column: "BU Description" },
    { column: "Open Block Number" },
    { column: "Open Block Date" },
    { column: "Subscriber Type Name" },
    { column: "Status Name" },
    { column: "Remarks" },
    { column: "Approved Date" },
    { column: "Approved By Name" },
    { column: "Submitted Date" },
    { column: "Submitted By Name" },
    { column: "Cancelled Date" },
    { column: "Cancelled By Name" },
    { column: "Created Date" },
    { column: "Created By Name" },
    { column: "Modified Date" },
    { column: "Modified By Name" },
  ];
  const [data, setData] = useState<IOpenBlock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const [openNewBlock, setOpenNewBlock] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openLovStatus, setOpenLovStatus] = useState(false);

  const [selectedRowData, setSelectedRowData] =
    useState<IOpenBlock>(initOpenBlockData);

  const [selectedLovStatusRow, setSelectedLovStatusRow] = useState({
    status: 0,
    status_name: "",
  });

  const [openLovBU, setOpenLovBU] = useState(false);
  const [openBUFailure, setOpenBUFailure] = useState(false);
  const [selectedLovBURow, setSelectedLovBURow] = useState({
    bu_id: 0,
    bu_code: "",
    bu_description: "",
  });

  const handleOpenAdd = () => {
    if (businessUnit.bu_id === 0) {
      setOpenBUFailure(true);
      return
    }
    setSelectedRowData(initOpenBlockData);
    setOpenNewBlock(true);
  };

  const handleOpenEdit = () => {
    if (selectedRowData.id === 0) return;
    setOpenNewBlock(true);
  };

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );
  const buData = localStorage.getItem("business_unit");
  const persistedBu = buData ? JSON.parse(buData) : initBusinessUnit;
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit>(persistedBu);

  useEffect(() => {
    const functionName = "SELECT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm610t/onselect`;
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
              id: 0,
              bu_id: businessUnit.bu_id,
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

  console.log(data);
  return (
    <div style={{ padding: "1rem", backgroundColor: "white" }}>
      <MenuBar
        searchQuery={searchQuery}
        setKeyword={setKeyword}
        setPageNumber={setPageNumber}
        setSearchQuery={setSearchQuery}
        handleAdd={handleOpenAdd}
        handleEdit={handleOpenEdit}
      >
        <>
          <button
            className="menu-icon"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Filter"
            onClick={() => setOpenFilter(true)}
          >
            <GrFilter size={18} />
          </button>
        </>
      </MenuBar>

      <TableGrid column={column}>
        <tbody ref={tableBodyRef}>
          {data &&
            data.map((d, i) => (
              <tr
                key={i}
                ref={(el) => (refs.current[i] = el)}
                onKeyDown={(evt) => handleKeyDown(evt, data)}
                onClick={() => {
                  handleClick(data, i);
                  setSelectedRowData(d);
                }}
                onDoubleClick={() => {
                  setSelectedRowData(d);
                }}
                tabIndex={i}
                style={{
                  backgroundColor: selectedRow.id === d.id ? "pink" : "",
                }}
              >
                <td>{d.bu_code}</td>
                <td>{d.bu_description}</td>
                <td>{d.open_block_number}</td>
                <td>
                  {d.open_block_date ? (
                    <>
                      {moment(d.open_block_date).format("DD-MM-YYYY HH:mm:ss")}
                    </>
                  ) : (
                    <>{d.open_block_date}</>
                  )}
                </td>
                <td>{d.subscriber_type_name}</td>
                <td>{d.status_name}</td>
                <td>{d.remarks}</td>
                <td>
                  {d.approved_date ? (
                    <>{moment(d.approved_date).format("DD-MM-YYYY HH:mm:ss")}</>
                  ) : (
                    <>{d.approved_date}</>
                  )}
                </td>
                <td>{d.approved_by_name}</td>
                <td>
                  {d.submitted_date ? (
                    <>
                      {moment(d.submitted_date).format("DD-MM-YYYY HH:mm:ss")}
                    </>
                  ) : (
                    <>{d.submitted_date}</>
                  )}
                </td>
                <td>{d.submitted_by_name}</td>
                <td>
                  {d.cancelled_date ? (
                    <>
                      {moment(d.cancelled_date).format("DD-MM-YYYY HH:mm:ss")}
                    </>
                  ) : (
                    <>{d.cancelled_date}</>
                  )}
                </td>
                <td>{d.cancelled_by_name}</td>
                <td>
                  {d.created_date ? (
                    <>{moment(d.created_date).format("DD-MM-YYYY HH:mm:ss")}</>
                  ) : (
                    <>{d.created_date}</>
                  )}
                </td>
                <td>{d.created_by_name}</td>
                <td>
                  {d.modified_date ? (
                    <>{moment(d.modified_date).format("DD-MM-YYYY HH:mm:ss")}</>
                  ) : (
                    <>{d.modified_date}</>
                  )}
                </td>
                <td>{d.modified_by_name}</td>
              </tr>
            ))}
        </tbody>
      </TableGrid>
      <Paging
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        totalRecord={totalRecord}
      />
      <OpenNewBlock
        open={openNewBlock}
        close={() => setOpenNewBlock(false)}
        selectedRowOpenBlock={selectedRowData}
        setSelectedRowOpenBlock={setSelectedRowData}
      />
      <Modal
        open={openFilter}
        close={() => setOpenFilter(false)}
        title="Filter"
      >
        <div style={{ padding: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              padding: "1rem",
              border: "1px solid #e8e8e8",
            }}
          >
            <div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "200px",
                    textAlign: "right",
                    marginRight: "5px",
                  }}
                >
                  Business Unit:
                </div>
                <div style={{ display: "flex" }}>
                  <input
                    value={selectedLovBURow.bu_code}
                    style={{ width: "70px" }}
                  />
                  <InputLov
                    value={selectedLovBURow.bu_description}
                    btnOnClick={() => setOpenLovBU(true)}
                  />
                  {/* <input value={selectedLovBURow.bu_description}/>
                  <button onClick={()=>setOpenLovBU(true)}>lov</button> */}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "200px",
                    textAlign: "right",
                    marginRight: "5px",
                  }}
                >
                  Open Block Number:
                </div>
                <div>
                  <input />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "200px",
                    textAlign: "right",
                    marginRight: "5px",
                  }}
                >
                  Open Block Date From:
                </div>
                <div>
                  <input type="date" />

                  <span>To: </span>
                  <input type="date" />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "200px",
                    textAlign: "right",
                    marginRight: "5px",
                  }}
                >
                  Status:
                </div>
                <div>
                  <InputLov
                    value={selectedLovStatusRow.status_name}
                    btnOnClick={() => setOpenLovStatus(true)}
                  />
                  {/* <input value={selectedLovStatusRow.status_name} />
                  <button onClick={() => setOpenLovStatus(true)}>Lov</button> */}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "200px",
                    textAlign: "right",
                    marginRight: "5px",
                  }}
                >
                  Remarks:
                </div>
                <div>
                  <input />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
              paddingTop: "10px",
            }}
          >
            <div>
              <button className="btn-left secondary-btn">Close</button>
              <button className="primary-btn">Filter</button>
            </div>
          </div>
        </div>
      </Modal>
      <LovStatus
        open={openLovStatus}
        close={() => setOpenLovStatus(false)}
        setSelectedLovRow={setSelectedLovStatusRow}
      />
      <LovBU
        open={openLovBU}
        close={() => setOpenLovBU(false)}
        setSelectedLovRow={setSelectedLovBURow}
      />
      <Modal
        open={openBUFailure}
        close={() => setOpenBUFailure(false)}
        title="Oops.."
      >
        <div style={{padding: '2rem'}}>

        Select Business Unit First, Please!
        </div>
      </Modal>
    </div>
  );
}
