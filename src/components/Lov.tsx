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
      <div style={{ marginBottom: "10px", boxSizing: "border-box" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setKeyword(searchQuery);
          }}
        >
          <div>
            <label>Search</label>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="menu-icon">
              <FaSearch />
            </button>
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
        <button
          style={{
            border: "none",
            backgroundColor: "#e8e8e8",
            borderRadius: "10px",
            padding: "5px 20px",
            width: "100px",
            marginRight: "10px",
            height: "35px",
          }}
          onClick={handleClose}
        >
          Close
        </button>
        <button
          style={{
            border: "none",
            backgroundColor: "black",
            color: "white",
            borderRadius: "10px",
            padding: "5px 20px",
            height: "35px",
            width: "100px",
          }}
          onClick={handleSelect}
        >
          Select
        </button>
      </div>
    </Modal>
  );
};
