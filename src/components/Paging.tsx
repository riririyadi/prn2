import React, { useContext } from 'react';
import {
  CgChevronLeftR,
  CgChevronRightR,
  CgPushChevronLeftR,
  CgPushChevronRightR,
} from 'react-icons/cg';
import { ThemeCtx } from '../pages/Home';

export const Paging = ({
  pageNumber,
  pageSize,
  totalRecord,
  setPageNumber,
}: {
  pageNumber: number;
  pageSize: number;
  totalRecord: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [darkMode, setDarkMode] = useContext(ThemeCtx);

  return (
    <div style={{ marginTop: '20px' }}>
      <button
        className='btn-no-style'
        onClick={() => setPageNumber(1)}
        disabled={pageNumber === 1}
      >
        <CgPushChevronLeftR
          size={26}
          className={darkMode ? 'dark' : 'bright'}
        />
      </button>
      <button
        className='btn-no-style'
        onClick={() => setPageNumber(pageNumber - 1)}
        disabled={pageNumber === 1}
      >
        <CgChevronLeftR size={26} className={darkMode ? 'dark' : 'bright'} />
      </button>
      {totalRecord > 0 ? (
        <span style={{ margin: '0px 20px' }}>
          {(pageNumber - 1) * pageSize + 1} -{' '}
          {pageNumber * pageSize > totalRecord ? (
            <span>{totalRecord}</span>
          ) : (
            <span>{pageNumber * pageSize}</span>
          )}{' '}
          of {totalRecord}
        </span>
      ) : (
        <span></span>
      )}
      <button
        className='btn-no-style'
        onClick={() => setPageNumber(pageNumber + 1)}
        disabled={pageSize * pageNumber >= totalRecord}
      >
        <CgChevronRightR size={26} className={darkMode ? 'dark' : 'bright'} />
      </button>
      <button
        className='btn-no-style'
        onClick={() => setPageNumber(Math.ceil(totalRecord / pageSize))}
        disabled={pageSize * pageNumber >= totalRecord}
      >
        <CgPushChevronRightR
          size={26}
          className={darkMode ? 'dark' : 'bright'}
        />
      </button>
    </div>
  );
};
