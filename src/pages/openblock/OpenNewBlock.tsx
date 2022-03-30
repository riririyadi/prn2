import { FC, forwardRef, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { IModalProps } from "../../components/Modal";
import { Modal } from "../../components/Modal";
import { Paging } from "../../components/Paging";
import { TableGrid } from "../../components/TableGrid";
import { AssignNumberDetail } from "./AssignNumberDetail";
import { ViewLogs } from "./ViewLogs";
import { ViewResourceDetail } from "./ViewResourceDetail";

export const OpenNewBlock = 
  ({ title, level, width, height, open, children, close }: IModalProps) => {
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
    const [openViewResourceDetails, setOpenViewResourceDetails] =
      useState(false);
    const [openAddLine, setOpenAddLine] = useState(false);



    return (
      <>
        <Modal
          open={open}
          title={title}
          level={level}
          width={width}
          height={height}
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
                <input />
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
                <input />
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
                <input />
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
                <input />
              </div>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "100px",
                    textAlign: "right",
                    marginRight: "5px",
                  }}
                >
                  Remark:
                </div>
                <input />
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
                <input />
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
                <input />
              </div>
            </div>
          </div>
          <TableGrid column={column} heightPercentage={60}>
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
                <input style={{ width: "120px" }} />
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "120px", textAlign: "right" }}>
                  Created date:
                </div>
                <input style={{ width: "120px" }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "120px", textAlign: "right" }}>
                  Modified by:
                </div>
                <input style={{ width: "120px" }} />
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "120px", textAlign: "right" }}>
                  Modified date:
                </div>
                <input style={{ width: "120px" }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "120px", textAlign: "right" }}>
                  Submitted by:
                </div>
                <input style={{ width: "120px" }} />
              </div>

              <div style={{ display: "flex" }}>
                <div style={{ width: "120px", textAlign: "right" }}>
                  Submitted date:
                </div>
                <input style={{ width: "120px" }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "120px", textAlign: "right" }}>
                  Approved by:
                </div>
                <input style={{ width: "120px" }} />
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "120px", textAlign: "right" }}>
                  Aprroved date:
                </div>
                <input style={{ width: "120px" }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "120px", textAlign: "right" }}>
                  Canceled by:
                </div>
                <input style={{ width: "120px" }} />
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "120px", textAlign: "right" }}>
                  Canceled date:
                </div>
                <input style={{ width: "120px" }} />
              </div>
            </div>
          </div>
          <div
            style={{
              border: "1px solid #e8e8e8",
              padding: "1rem",
              justifyContent: "center",
              display: "flex",
              marginTop: "10px",
            }}
          >
            <div>
              <button>New</button>
              <button>Refresh</button>
              <button onClick={() => setOpenAddLine(true)}>Add Line</button>
              <button>Submit</button>
              <button>Approve</button>
              <button>Cancel</button>
              <button onClick={() => setOpenViewResourceDetails(true)}>
                View Resource Detail
              </button>
              <button onClick={() => setOpenViewLogs(true)}>View Log</button>
              <button>View Content File</button>
              <button>Close</button>
            </div>
          </div>
        </Modal>
        <AssignNumberDetail
          open={openAddLine}  close={() => setOpenAddLine(false)} level={2} title='Assign Number Detail'
        />
        <ViewLogs open={openViewLogs} close={() => setOpenViewLogs(false)} />
        <ViewResourceDetail
          open={openViewResourceDetails}
          close={() => setOpenViewResourceDetails(false)}
        />
      </>
    );
  };
