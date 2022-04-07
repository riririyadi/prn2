import axios from "axios";
import md5 from "md5";
import moment from "moment";
import { useContext, useRef, useState } from "react";
import { FormIdContext } from "../../components/MainArea";
import { Modal } from "../../components/Modal";
import { Paging } from "../../components/Paging";
import { TableGrid } from "../../components/TableGrid";
import { BusinessUnit, initBusinessUnit } from "../Home";
import { AssignNumberDetail } from "./AssignNumberDetail";
import { IOpenBlock } from "./OpenBlock";
import { ViewLogs } from "./ViewLogs";
import { ViewResourceDetail } from "./ViewResourceDetail";
import { initOpenBlockData } from "./OpenBlock";

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

interface IOpenNewBlock {
  open: boolean
  close: () => void
  selectedRowOpenBlock: IOpenBlock
  setSelectedRowOpenBlock: React.Dispatch<React.SetStateAction<IOpenBlock>>
}

export const OpenNewBlock = ({
  open,
  close,
  selectedRowOpenBlock,
  setSelectedRowOpenBlock
}: IOpenNewBlock) => {


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
  const buData = localStorage.getItem("business_unit");
  const persistedBu = buData ? JSON.parse(buData) : initBusinessUnit;
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit>(persistedBu);

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

  const [openViewLogs, setOpenViewLogs] = useState(false);
  const [openViewResourceDetails, setOpenViewResourceDetails] = useState(false);
  const [openAddLine, setOpenAddLine] = useState(false);
 
  const handleSave = () => {
    console.log(businessUnit.bu_id);
    const functionName = "INSERT_ALLOWED";
    const url = `${baseURL}/prn/ob/tcnpm610t/oninsert`;
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
              bu_id: businessUnit.bu_id,
              open_block_date: moment(selectedRowOpenBlock.open_block_date).format('DD-MM-YYYY'),
              subscriber_type: parseInt(selectedRowOpenBlock.subscriber_type),
              remarks: selectedRowOpenBlock.remarks,
              created_by:user.user_id
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
        if(response.data.Reply.status === 0){
          setSelectedRowOpenBlock(response.data.Data)
        }
      })
      .catch((error) => console.log(error))
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setSelectedRowOpenBlock(prevData => ({...prevData, [name]:value}))
  }
  

  return (
    <>
      <Modal
        open={open}
        title="New Open Block"
        close={close}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
            border: "1px solid #e8e8e8",
            marginBottom: "10px",
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
                Open New Block Number:
              </div>
              <input value={selectedRowOpenBlock.open_block_number} readOnly/>
            </div>

            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "200px",
                  textAlign: "right",
                  marginRight: "5px",
                }}
              >
                Open New Block Date:
              </div>
              <input type="datetime-local" name="open_block_date" value={selectedRowOpenBlock.open_block_date}  className="required-field" onChange={handleChange}/>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "200px",
                  textAlign: "right",
                  marginRight: "5px",
                }}
              >
                Subscriber Type:
              </div>
              <select name="subscriber_type" value={selectedRowOpenBlock.subscriber_type} onChange={handleChange}>
                <option value={-1}></option>
                <option value={0}>Prepaid</option>
                <option value={1}>Postpaid</option>
              </select>
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
                Status:
              </div>
              <input value={selectedRowOpenBlock.status_name} readOnly/>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "100px",
                  textAlign: "right",
                  marginRight: "5px",
                }}
              >
                Remarks:
              </div>
              <input name="remarks" value={selectedRowOpenBlock.remarks} onChange={handleChange}/>
            </div>
          </div>
          <div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "150px",
                  textAlign: "right",
                  marginRight: "5px",
                }}
              >
                BU Code:
              </div>
              <input value={selectedRowOpenBlock.id ? selectedRowOpenBlock.bu_code:businessUnit.bu_code} readOnly/>
            </div>

            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "150px",
                  textAlign: "right",
                  marginRight: "5px",
                }}
              >
                BU Description:
              </div>
              <input value={selectedRowOpenBlock.id ? selectedRowOpenBlock.bu_description:businessUnit.bu_description} readOnly/>
            </div>
          </div>
        </div>
        <TableGrid column={column} heightPercentage={60}>
          <tbody>
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
              <div style={{ width: "120px", textAlign: "right" }}>
                Created by:
              </div>
              <input
                style={{ width: "120px" }}
                value={selectedRowOpenBlock.created_by_name}
                className="read-only-field"
                readOnly
              />
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "120px", textAlign: "right" }}>
                Created date:
              </div>
              <input
                style={{ width: "120px" }}
                className="read-only-field"
                type="datetime-local"
                value={selectedRowOpenBlock.created_date}
                readOnly
              />
            </div>
          </div>
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "120px", textAlign: "right" }}>
                Modified by:
              </div>
              <input
                style={{ width: "120px" }}
                className="read-only-field"
                value={selectedRowOpenBlock.modified_by_name}
                readOnly
              />
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "120px", textAlign: "right" }}>
                Modified date:
              </div>
              <input
                style={{ width: "120px" }}
                className="read-only-field"
                type="datetime-local"
                value={selectedRowOpenBlock.modified_date}
                readOnly
              />
            </div>
          </div>
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "120px", textAlign: "right" }}>
                Submitted by:
              </div>
              <input
                style={{ width: "120px" }}
                className="read-only-field"
                readOnly
                value={selectedRowOpenBlock.submitted_by_name}
              />
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ width: "120px", textAlign: "right" }}>
                Submitted date:
              </div>
              <input
                style={{ width: "120px" }}
                className="read-only-field"
                readOnly
                type="datetime-local"
                value={selectedRowOpenBlock.submitted_date}
              />
            </div>
          </div>
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "120px", textAlign: "right" }}>
                Approved by:
              </div>
              <input
                style={{ width: "120px" }}
                className="read-only-field"
                readOnly
                value={selectedRowOpenBlock.approved_by_name}
              />
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "120px", textAlign: "right" }}>
                Aprroved date:
              </div>
              <input
                style={{ width: "120px" }}
                className="read-only-field"
                readOnly
                type="datetime-local"
                value={selectedRowOpenBlock.approved_date}
              />
            </div>
          </div>
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "120px", textAlign: "right" }}>
                Canceled by:
              </div>
              <input
                style={{ width: "120px" }}
                className="read-only-field"
                readOnly
                value={selectedRowOpenBlock.cancelled_by_name}
              />
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "120px", textAlign: "right" }}>
                Canceled date:
              </div>
              <input
                style={{ width: "120px" }}
                className="read-only-field"
                type="datetime-local"
                readOnly
                value={selectedRowOpenBlock.cancelled_date}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            border: "1px solid #e8e8e8",
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <div>
            <button className="secondary-btn" onClick={() => setSelectedRowOpenBlock(initOpenBlockData)}>New</button>
            <button className="secondary-btn">Refresh</button>
            <button className="secondary-btn" onClick={handleSave}>Save</button>
            <button
              className="secondary-btn"
              onClick={() => setOpenAddLine(true)}
            >
              Add Line
            </button>
            <button className="secondary-btn">Submit</button>
            <button className="secondary-btn">Approve</button>
            <button className="secondary-btn">Cancel</button>
            <button
              className="secondary-btn"
              onClick={() => setOpenViewResourceDetails(true)}
            >
              View Resource Detail
            </button>
            <button
              className="secondary-btn"
              onClick={() => setOpenViewLogs(true)}
            >
              View Log
            </button>
            <button className="secondary-btn">View Content File</button>
            <button className="secondary-btn">Close</button>
          </div>
        </div>
      </Modal>
      <AssignNumberDetail
        open={openAddLine}
        close={() => setOpenAddLine(false)}
      />
      <ViewLogs open={openViewLogs} close={() => setOpenViewLogs(false)} />
      <ViewResourceDetail
        open={openViewResourceDetails}
        close={() => setOpenViewResourceDetails(false)}
      />
    </>
  );
};
