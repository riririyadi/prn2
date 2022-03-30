import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import { AppCtx } from '../pages/Home';
import { TiChartArea } from 'react-icons/ti';
import {
  FaCity,
  FaElementor,
  FaBuilding,
  FaFileInvoiceDollar,
} from 'react-icons/fa';

function Sidebar(props: any) {
  const { menuData } = props;

  const { pathname } = useLocation();

  const array = [
    'city',
    'company',
    'country',
    'customer',
    'province',
    'transaction',
  ];

  const [tabList, setTabList, activeTab, setActiveTab] =
    React.useContext(AppCtx);

  const handleAdd = () => {
    if (pathname !== '/home') {
      return;
    }
    let id = tabList[tabList.length - 1].id + 1;
    setTabList([
      ...tabList,
      {
        key: id,
        id,
        component: array[Math.floor(Math.random() * 6)],
        formId: 0,
      },
    ]);
    setActiveTab(tabList[tabList.length - 1].id + 1);
  };

  return (
    <aside className='sidenav'>
      {menuData &&
        menuData.map((m: any, i: number) => (
          <li
            key={i}
            style={{
              listStyleType: 'none',
              padding: m.children ? '10px 10px 10px 10px' : '10px',
            }}
          >
            <button
              style={{
                border: 'none',
                background: 'none',
                width: '100%',
              }}
              data-bs-toggle='collapse'
              data-bs-target={`#demo${i}`}
              className='text-nowrap text-start collapsed-btn'
              aria-expanded='false'
              aria-controls={`#demo${i}`}
              {...(!m.sub_menu && { onClick: handleAdd })}
            >
              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{m.menu_prompt}</span>
                {m.sub_menu && <span>&gt;</span>}
              </span>
            </button>
            {m.sub_menu && (
              <div
                className='collapse'
                id={`demo${i}`}
                data-bs-target={`#demo${i}`}
                aria-expanded='false'
                aria-controls={`#demo${i}`}
                style={{
                  paddingTop: '10px',
                  paddingLeft: '10px',
                }}
              >
                {m.sub_menu?.map((c: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      listStyleType: 'none',
                      padding: c.sub_menu ? '10px 0px' : '10px',
                    }}
                  >
                    <button
                      style={{
                        border: 'none',
                        background: 'none',
                        width: '100%',
                      }}
                      data-bs-toggle='collapse'
                      data-bs-target={`#submenu${i}`}
                      className='text-nowrap text-start'
                      {...(!c.sub_menu && { onClick: handleAdd })}
                    >
                      <span
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{c.menu_prompt}</span>
                        {c.sub_menu && <span>&gt;</span>}
                      </span>
                    </button>
                    {c.sub_menu && (
                      <div
                        className='collapse'
                        id={`submenu${i}`}
                        style={{ paddingTop: '10px' }}
                      >
                        {c.sub_menu?.map((d: any, i: number) => (
                          <ul
                            key={`${d.menu_prompt}${i}`}
                            className='text-nowrap'
                            {...(!d.sub_menu && { onClick: handleAdd })}
                          >
                            {d.menu_prompt}
                          </ul>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
    </aside>
  );
}

export default React.memo(Sidebar);
