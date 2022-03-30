import React, { useContext, useEffect } from 'react';
import { FaHeadSideMask } from 'react-icons/fa';
import { TiWarningOutline } from 'react-icons/ti';
import { ThemeCtx } from '../pages/Home';

type columnTable = {
  column: string;
};

export const TableGrid = ({
  column,
  children,
  error,
  heightPercentage = 100,
  data,
  setActiveIndex,
  activeIndex,
  frezee = false,
}: {
  column: columnTable[];
  children?: React.ReactNode;
  error?: string;
  heightPercentage?: number;
  data?: any[];
  setActiveIndex?: React.Dispatch<React.SetStateAction<number>>;
  activeIndex?: number;
  frezee?: boolean;
}) => {

  return (
    <div
      // id='table-scroll'
      // className='table-scroll'
      className='tableFixHead'
      style={{ height: `calc(${heightPercentage}vh - 220px)` }}
    >
      <table id='main-table' className='main-table'>
        <thead>
          <tr className={frezee ? 'frezee' : ''}>
            {column &&
              column.map((c, i) => (
                <th className='text-nowrap' key={i}>
                  {c.column}
                </th>
              ))}
          </tr>
        </thead>
        {children}
      </table>
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            color: 'red',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'cennter',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div>
              <TiWarningOutline color='red' size={26} />
            </div>
            <div>{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};
