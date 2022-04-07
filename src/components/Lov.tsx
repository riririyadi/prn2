import React, { FC, forwardRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IModalProps, Modal } from "./Modal";
import { Paging } from "./Paging";

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
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  totalRecord: number;
  pageSize: number;
}

export const Lov = ({
  title,
  level,
  width,
  height,
  open,
  close,
  children,
  handleSelect,
  handleClose,
  setKeyword,
  pageNumber,
  setPageNumber,
  totalRecord,
  pageSize,
}: IModalLovProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Modal
      open={open}
      title={title}
      level={level}
      width={width}
      height={height}
      close={close}
    >
      <div style={{ marginBottom: "10px" }}>
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button className="search-button" type="submit">
                <FaSearch />
              </button>
            </div>
          </div>
        </form>
      </div>
      {children}
      <Paging
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        totalRecord={totalRecord}
        pageSize={pageSize}
      />
      <br />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="secondary-btn btn-left" onClick={handleClose}>
          Close
        </button>
        <button className="primary-btn" onClick={handleSelect}>
          Select
        </button>
      </div>
    </Modal>
  );
};
