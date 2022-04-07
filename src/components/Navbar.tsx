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


  const {bu_id, bu_code, bu_description} = props.bu;

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

  const [openChangePassword, setOpenChangePassword] = useState(false);

  let navigate = useNavigate();

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
        <div style={{fontSize:"10pt"}}>
          <div><b>Company: <i>{user.company_description}</i></b></div>
          {bu_id !== 0 && (
            <div>
              <b>Business Unit: <i>{bu_code} - {bu_description}</i></b>
            </div>
          )}
        </div>
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
              {width >= 768 && <>{user.user_description}</>}
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
                  onClick={props.openBU}
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
