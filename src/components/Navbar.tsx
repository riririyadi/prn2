import React, { useEffect, useState, useCallback, useContext } from "react";
import "../styles/Navbar.css";
import { FaUserCircle, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import moment from "moment";
import md5 from "md5";
import { VscSearch } from "react-icons/vsc";
import { Loader } from "./Loader";
import Draggable from "react-draggable";
import { useAuth } from "../utils/auth";
import { AppCtx, ThemeCtx } from "../pages/Home";
import { MdOutlinePassword } from "react-icons/md";
import { Modal } from "./Modal";
import { FormIdContext } from "./MainArea";
import { FiLogOut } from "react-icons/fi";
import { IoIosBusiness } from "react-icons/io";
import { CgMenu } from "react-icons/cg";
import { useWindowSize } from "../utils/useWindowSize";

const baseURL: string = process.env.REACT_APP_BASE_URL as string;
const secretKey: string = process.env.REACT_APP_SECRET_KEY as string;
const apiKey: string = process.env.REACT_APP_API_KEY as string;

interface BusinessUnits {
  bu_code: string;
  bu_description: string;
  bu_id: number;
}

export default function Navbar(props: any) {
  const auth = useAuth();
  const { width } = useWindowSize();
  const formId = useContext(FormIdContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
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
  const [darkMode, setDarkMode] = useContext(ThemeCtx);

  const {
    company_code,
    company_description,
    company_id,
    session,
    user_description,
    user_id,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [keywordBU, setKeywordBU] = useState("%");
  const [totalRecordBU, setTotalRecordBU] = useState(null);
  const [pageNumberBU, setPageNumberBU] = useState(1);
  const [pageSizeBU, setPageSizeBU] = useState(10);
  const [isOpenBU, setIsOpenBU] = useState(false);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnits[]>([]);

  let navigate = useNavigate();

  const countBusinessUnits = useCallback(() => {
    setIsLoading(true);
    let timestamp = moment().format("YYYYMMDDHHmmss");
    let { responsibility_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );
    let md5hash = md5(
      `${company_id}${user_id}${responsibility_id}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/users/oncountbu`;
    axios
      .post(
        url,
        {
          timestamp,
          company_id: company_id,
          user_id: user_id,
          responsibility_id,
          keyword: keywordBU,
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
        setTotalRecordBU(response.data.total_record);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [keywordBU, company_id, user_id]);

  const getListOfBusinessUnits = useCallback(() => {
    setIsLoading(true);
    let timestamp = moment().format("YYYYMMDDHHmmss");
    let { responsibility_id } = JSON.parse(
      localStorage.getItem("responsibility") || "null"
    );

    let md5hash = md5(
      `${company_id}${user_id}${responsibility_id}${timestamp}${secretKey}`
    );
    let url = `${baseURL}/prn/fnd/users/onselectbu`;

    axios
      .post(
        url,
        {
          timestamp,
          company_id: company_id,
          user_id: user_id,
          responsibility_id,
          keyword: keywordBU,
          pagenumber: pageNumberBU,
          pagesize: pageSizeBU,
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
        setIsLoading(false);
        setBusinessUnits(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [keywordBU, pageNumberBU, pageSizeBU, company_id, user_id]);

  const PageInfoBU = () => {
    return (
      <span>
        {(pageNumberBU - 1) * pageSizeBU + 1} -{" "}
        {pageNumberBU * pageSizeBU > totalRecordBU! ? (
          <span>{totalRecordBU}</span>
        ) : (
          <span>{pageNumberBU * pageSizeBU}</span>
        )}{" "}
        / {totalRecordBU}
      </span>
    );
  };

  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px",
          backgroundColor: "rgb(41, 37, 37)",
          color: "white",
          zIndex: "10",
        }}
      >
        <div
          style={{
            marginLeft: "20px",
            marginTop: "5px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {width < 768 && (
            <div style={{ marginRight: "10px", marginBottom: "5px" }}>
              <CgMenu size={24} onClick={props.toggleSideNav} />
            </div>
          )}
          <img
            alt="nav-logo"
            height={40}
            width={130}
            src="https://www.telkomsel.com/sites/default/files/mainlogo-v3.png"
          />
        </div>
        <div>Company: {company_description}</div>
        <div style={{ marginRight: "20px" }}>
          <div className="dropdown">
            <button
              style={{ background: "none", border: "none", color: "white" }}
              className="dropdown-toggle"
              type="button"
              id="dropdownMenu2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUserCircle size={24} />{" "}
              {width >= 768 && <>{user_description}</>}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  style={{ fontSize: "11pt" }}
                  onClick={props.open}
                >
                  <FaUsers />{" "}
                  <span style={{ marginLeft: "10px" }}>
                    Change Responsibilities
                  </span>
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  style={{ fontSize: "11pt" }}
                  onClick={() => {
                    setIsOpenBU(true);
                    getListOfBusinessUnits();
                    countBusinessUnits();
                  }}
                >
                  <IoIosBusiness />{" "}
                  <span style={{ marginLeft: "10px" }}>
                    Change Business Unit
                  </span>
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  style={{ fontSize: "11pt" }}
                  onClick={() => setOpenChangePassword(true)}
                >
                  <MdOutlinePassword />{" "}
                  <span style={{ marginLeft: "10px" }}>Change Password</span>
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  style={{ fontSize: "11pt" }}
                  onClick={() => {
                    auth.logout();
                    navigate("/", { replace: true });
                    localStorage.clear();
                  }}
                >
                  <FiLogOut />{" "}
                  <span style={{ marginLeft: "10px" }}>Sign Out</span>
                </button>
              </li>
            </ul>
          </div>
        </div>{" "}
      </nav>
      <Modal open={isOpenBU} close={() => setIsOpenBU(false)} title="List of Business Units">
        <div>
          <VscSearch size={24} style={{ marginRight: "10px" }} />
          <input
            value={keywordBU}
            placeholder="Enter a keyword"
            onChange={(e) => {}}
          />
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader />
            </div>
          ) : (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">BU Code</th>
                  <th scope="col">BU Description</th>
                </tr>
              </thead>
              <tbody>
                {businessUnits &&
                  businessUnits.map((bu, i) => (
                    <tr key={bu.bu_id}>
                      <th scope="row">
                        {(pageNumberBU - 1) * pageSizeBU + (i + 1)}
                      </th>
                      <td>{bu.bu_code}</td>
                      <td>{bu.bu_description}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          {!businessUnits && <div className="text-center">No data</div>}
          <div className="d-flex justify-content-between">
            <div>
              <button
                onClick={() => {
                  if (pageNumberBU > 1) {
                    setPageNumberBU(pageNumberBU - 1);
                    getListOfBusinessUnits();
                  }
                }}
                style={{
                  border: "none",
                  backgroundColor: "#d2d2d2",
                  padding: "5px 12px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              >
                &lt;
              </button>
              <button
                onClick={() => {
                  setPageNumberBU(pageNumberBU + 1);
                  getListOfBusinessUnits();
                }}
                style={{
                  border: "none",
                  backgroundColor: "#d2d2d2",
                  padding: "5px 12px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              >
                &gt;
              </button>
            </div>
            <div>{totalRecordBU && PageInfoBU()}</div>
          </div>

          <br />

          <button
            onClick={() => {
              setIsOpenBU(false);
              setPageNumberBU(1);
            }}
            style={{
              border: "none",
              backgroundColor: "#e8e8e8",
              borderRadius: "10px",
              padding: "5px 20px",
              marginRight: "10px",
            }}
          >
            Close
          </button>
          <button
            onClick={() => {}}
            style={{
              border: "none",
              backgroundColor: "black",
              color: "white",
              borderRadius: "10px",
              padding: "5px 20px",
            }}
          >
            Select
          </button>
        </div>
      </Modal>

      <Modal
        open={openChangePassword}
        close={() => setOpenChangePassword(false)}
        title="Change Password"
      >
        <div className="custom-modal">
          <div>
            <label>Old Password</label>
            <br />
            <input
              type="password"
              name="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <label>New Password</label>
            <br />
            <input
              type="password"
              name="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Confirm New Password</label>
            <br />
            <input
              type="password"
              name="confirm"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <button
              className="secondary-btn"
              onClick={() => setOpenChangePassword(false)}
            >
              Close
            </button>
            <button
              className="primary-btn"
              // onClick={handleChangePassword}
              disabled={
                !newPassword ||
                !confirmNewPassword ||
                newPassword !== confirmNewPassword
              }
            >
              Change Password
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
