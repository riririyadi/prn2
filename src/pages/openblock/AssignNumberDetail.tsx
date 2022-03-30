import { FC, forwardRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { Lov } from "../../components/Lov";
import { IModalProps, Modal } from "../../components/Modal";

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

// const LovArea = ({ open, close }: { open: boolean; close: () => void }) => {
//   const [keyword, setKeyword] = useState("");
//   const handleClose = () => {
//     close()
//   }
//   return (
//     <Lov
//       setKeyword={setKeyword}
//       open={open}
//       close={close}
//       title="List of Area"
//       level={3}
//       handleClose={handleClose}
//     >
//       <div></div>
//     </Lov>
//   );
// };

export const AssignNumberDetail = ({
  open,
  close,
  title,
  level,
  width,
  height,
  children,
}: IModalProps) => {
  const [type, setType] = useState("-1");
  const [openLovArea, setOpenLovArea] = useState(false);

  return (
    <>
      <Modal open={open} close={close} title={title}>
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
                    Area:
                  </div>
                  <div>
                    <input />
                    <button onClick={() => setOpenLovArea(true)}>lov</button>
                    <button>clear</button>
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
                    <input />
                    <button>lov</button>
                    <button>clear</button>
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
                    <input />
                    <button>lov</button>
                    <button>clear</button>
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
                    <input />
                    <button>lov</button>
                    <button>clear</button>
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
                    <input />
                    <button>lov</button>
                    <button>clear</button>
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
                    <input />
                    <button>lov</button>
                    <button>clear</button>
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
                      <input />
                      <button>lov</button>
                      <button>clear</button>
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
                      <input />
                      <button>lov</button>
                      <button>clear</button>
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
                      Prefix:
                    </div>
                    <div>
                      <input />
                      <button>lov</button>
                      <button>clear</button>
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
                  <div style={{ width: "120px", textAlign: "right" }}>
                    From NDC:
                  </div>
                  <input style={{ width: "120px" }} />
                  <button>LOV</button>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "120px", textAlign: "right" }}>
                    To NDC:
                  </div>
                  <input style={{ width: "120px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "120px", textAlign: "right" }}>HLR:</div>
                  <input style={{ width: "120px" }} />
                  <button>LOV</button>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "120px", textAlign: "right" }}>HLR</div>
                  <input style={{ width: "120px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "120px", textAlign: "right" }}>
                    Prefix:
                  </div>
                  <input style={{ width: "120px" }} />
                  <button>LOV</button>
                </div>

                <div style={{ display: "flex" }}>
                  <div style={{ width: "120px", textAlign: "right" }}>
                    Prefix:
                  </div>
                  <input style={{ width: "120px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "120px", textAlign: "right" }}>
                    Sequence:
                  </div>
                  <input style={{ width: "120px" }} />
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "120px", textAlign: "right" }}>
                    Sequence:
                  </div>
                  <input style={{ width: "120px" }} />
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
              <button>Submit</button>
              <button>Close</button>
            </div>
          </div>
        </div>
      </Modal>
      {/* <LovArea open={openLovArea} close={() => setOpenLovArea(false)} /> */}
    </>
  );
};
