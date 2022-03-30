import React, { useEffect, useRef, useState } from "react";
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


  const handleSelect = () =>{
    setSelectedLovRow(selectedRow);
    close();
  }

  const handleClose = () => {
    close()
  }

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
                onDoubleClick={() => {setSelectedLovRow(selectedRow); close()}}
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

export default function OpenBlock() {
  const column = [
    { column: "MSISDN" },
    { column: "IMSI" },
    { column: "Status" },
    { column: "NDC" },
    { column: "HLR" },
    { column: "Prefix" },
    { column: "Item Description" },
    { column: "Product Description" },
    { column: "Creation Date" },
    { column: "Created By" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalRecord1, setTotalRecord1] = useState("-1");
  const [openNewBlock, setOpenNewBlock] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openLovStatus, setOpenLovStatus] = useState(false);
  const [selectedLovStatusRow, setSelectedLovStatusRow] = useState({
    status: 0,
    status_name: "",
  });

  const handleOpenAdd = () => {
    setOpenNewBlock(true);
  };

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const { refs, handleKeyDown, selectedRow, handleClick } = useTableNavigation(
    tableBodyRef.current?.childElementCount
  );

  return (
    <div style={{ padding: "1rem", backgroundColor: "white" }}>
      <MenuBar
        searchQuery={searchQuery}
        setKeyword={setKeyword}
        setPageNumber={setPageNumber}
        setSearchQuery={setSearchQuery}
        handleAdd={handleOpenAdd}
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
        <tbody>
          <tr>
            <td> 234784574839</td>
            <td>09889897832748329</td>
            <td>ALLOCATED</td>
            <td>052</td>
            <td>01</td>
            <td className="text-nowrap">Resource AS</td>
            <td>078362</td>
            <td>3</td>
            <td>12-23-2322</td>
            <td>KayO</td>
          </tr>
          <tr>
            <td>234784574839</td>
            <td>09889897832748329</td>
            <td>ALLOCATED</td>
            <td>052</td>
            <td>01</td>
            <td className="text-nowrap">Resource AS</td>
            <td>078362</td>
            <td>3</td>
            <td>12-23-2322</td>
            <td>KayO</td>
          </tr>
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
        title="Open New Block"
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
                <div>
                  <input style={{ width: "70px" }} />
                  <input />
                  <button>lov</button>
                  <button>clear</button>
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
                  <input value={selectedLovStatusRow.status_name} />
                  <button onClick={() => setOpenLovStatus(true)}>Lov</button>
                  <button>clear</button>
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
              <button>Close</button>
              <button>Filter</button>
            </div>
          </div>
        </div>
      </Modal>
      <LovStatus
        open={openLovStatus}
        close={() => setOpenLovStatus(false)}
        setSelectedLovRow={setSelectedLovStatusRow}
      />
    </div>
  );
}
