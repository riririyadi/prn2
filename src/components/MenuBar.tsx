import React, { useContext } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CgLastpass, CgPassword, CgSandClock } from "react-icons/cg";
import { FaSearch, FaUserLock } from "react-icons/fa";
import { FiEdit, FiRefreshCcw, FiSearch } from "react-icons/fi";
import { IoMdTimer } from "react-icons/io";
import { VscNewFile, VscSearch } from "react-icons/vsc";
import { ThemeCtx } from "../pages/Home";

export const MenuBar = ({
  searchQuery,
  setSearchQuery,
  setKeyword,
  setPageNumber,
  handleEdit,
  handleAdd,
  handleRefresh,
  handleDelete,
  hidden,
  children,
  hiddenSearchBar = false,
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  handleEdit?: () => void;
  handleAdd?: () => void;
  handleRefresh?: () => void;
  handleDelete?: () => void;
  hidden?: string;
  children?: JSX.Element;
  hiddenSearchBar?: boolean;
}) => {
  return (
    <div className="menu__bar">
      <div className="menu__bar__item">
        <button
          hidden={hidden === "New"}
          className="menu-icon"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="New"
          onClick={handleAdd}
        >
          <VscNewFile size={20} />
        </button>

        <button
          hidden={hidden === "Edit"}
          className="menu-icon"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Edit"
          onClick={handleEdit}
        >
          <FiEdit size={20} />
        </button>
        <button
          hidden={hidden === "Refresh"}
          className="menu-icon"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Refresh"
          onClick={handleRefresh}
        >
          <FiRefreshCcw size={20} />
        </button>
        <button
          hidden={hidden === "Delete"}
          className="menu-icon"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Delete"
          onClick={handleDelete}
        >
          <AiOutlineDelete size={20} />
        </button>
        {children}
      </div>
      <div hidden={hiddenSearchBar} className="menu__bar__item">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setKeyword(searchQuery);
            setPageNumber(1);
          }}
        >
          <div className="container-box">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Search.."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />

              <button className="search-button" type="submit">
                <FaSearch />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
