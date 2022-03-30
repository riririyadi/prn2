import React, { useContext, useState } from 'react';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { RiArrowRightSLine } from 'react-icons/ri';
import { ThemeCtx } from '../pages/Home';

//Compound Component
function Subsubmenu({
  item,
  handleAdd,
}: {
  item: any;
  handleAdd: (component: string, formId: number) => void;
}) {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => {
    setSubnav(!subnav);
  };

  const [darkMode, setDarkMode] = useContext(ThemeCtx);
  return (
    <div style={{ margin: '10px 10px', width: '100%' }}>
      <div
        onDoubleClick={
          item.sub_menu_name
            ? showSubnav
            : () => handleAdd(item.file_name, item.form_id)
        }
        className={`nav-menu ${darkMode ? 'nav-menu-dark' : 'nav-menu-bright'}`}
      >
        <span className='nowrap-text'>{item.menu_prompt}</span>
        {item.sub_menu_name && (
          <span>
            <RiArrowRightSLine
              size={20}
              onDoubleClick={item.sub_menu_name && showSubnav}
              className={subnav ? 'rotate down' : 'rotate'}
            />
          </span>
        )}
      </div>
      {item.sub_menu_name && subnav && (
        <div style={{ margin: '10px 10px' }}>
          {item.sub_menu_name.map((s: any) => (
            <div
              className='nowrap-text'
              style={{ margin: '20px 15px', cursor: 'pointer' }}
              onDoubleClick={
                s.sub_menu_name
                  ? showSubnav
                  : () => handleAdd(item.file_name, item.form_id)
              }
            >
              {s.menu_prompt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Submenu({
  item,
  handleAdd,
}: {
  item: any;
  handleAdd: (component: string, formId: number) => void;
}) {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => {
    setSubnav(!subnav);
  };
  const [darkMode, setDarkMode] = useContext(ThemeCtx);

  return (
    <div style={{ margin: '10px 10px' }}>
      <div
        onDoubleClick={
          item.sub_menu_name
            ? showSubnav
            : () => handleAdd(item.file_name, item.form_id)
        }
        className={`nav-menu ${darkMode ? 'nav-menu-dark' : 'nav-menu-bright'}`}
      >
        <span className='nowrap-text'>{item.menu_prompt}</span>
        {item.sub_menu_name && (
          <span>
            {' '}
            <RiArrowRightSLine
              size={20}
              onDoubleClick={item.sub_menu_name && showSubnav}
              className={subnav ? 'rotate down' : 'rotate'}
            />
          </span>
        )}
      </div>
      {item.sub_menu_name && subnav && (
        <div style={{ margin: '10px 10px' }}>
          {item.sub_menu_name.map((s: any, i: number) => (
            <Subsubmenu key={i} item={s} handleAdd={handleAdd} />
          ))}
        </div>
      )}
    </div>
  );
}
