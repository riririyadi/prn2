import React from "react";
import { BiPlus } from "react-icons/bi";


type columnTable = {
  column: string;
};

export const TableGrid = ({
  column,
  children,
  heightPercentage = 100,
  frezee = false,
  addButton,
  addButtonOnClick,
}: {
  column: columnTable[];
  children?: React.ReactNode;
  error?: string;
  heightPercentage?: number;
  data?: any[];
  setActiveIndex?: React.Dispatch<React.SetStateAction<number>>;
  activeIndex?: number;
  frezee?: boolean;
  addButton?: boolean;
  addButtonOnClick?: () => void;
}) => {
  return (
    <div
      className="table-fix-head"
      style={{ height: `calc(${heightPercentage}vh - 220px)` }}
    >
      <table id="main-table" className="main-table">
        <thead>
          <tr className={frezee ? "frezee" : ""}>
            {addButton && (
              <th>
                <button onClick={addButtonOnClick} className="menu-icon">
                  <BiPlus size={20} color="white" />
                </button>
              </th>
            )}
            {column &&
              column.map((c, i) => (
                <th className="text-nowrap" key={i}>
                  {c.column}
                </th>
              ))}
          </tr>
        </thead>
        {children}
      </table>
    </div>
  );
};
