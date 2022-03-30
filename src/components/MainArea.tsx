import '../styles/Main.css';
import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  createContext,
  useContext,
} from 'react';
import { AppCtx, ThemeCtx } from '../pages/Home';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { CgChevronLeft, CgChevronRight, CgCloseR } from 'react-icons/cg';
import { COMPONENT_MAP } from '../utils/ComponentMapper';
import HomeIndex from '../pages/HomeIndex';
import { IoIosClose } from 'react-icons/io';
import NotFoundV2 from '../pages/NotFoundV2';
import { useWindowSize } from '../utils/useWindowSize';

export const FormIdContext = createContext<number>({} as any);

export default function MainArea(props: any) {
  const [tabList, setTabList, activeTab, setActiveTab] = useContext(AppCtx);
  const [darkMode, setDarkMode] = useContext(ThemeCtx);
  const { width, height } = useWindowSize();

  const { scrollerRef } = props;
  const [scrollOne, setScrollOne] = useState(false);

  const handleDelete = (id: number) => {
    const index = tabList.findIndex((tab) => tab.id === id);
    setTabList(tabList.filter((tab) => tab.id !== id));

    if (tabList.length === 2) {
      setActiveTab(0);
    }
    if (activeTab === id && id === tabList[tabList.length - 1].id) {
      setActiveTab(tabList[tabList.length - 1 - 1].id);
    }
    if (activeTab === id && id !== tabList[tabList.length - 1].id) {
      if (index === 1 && tabList.length > 2) {
        setActiveTab(tabList[index + 1].id);
      } else {
        setActiveTab(tabList[index - 1].id);
      }
    }
  };

  useEffect(() => {
    if (scrollerRef.current!.scrollWidth > myRef2.current!.clientWidth) {
      setScrollOne(true);
    } else {
      setScrollOne(false);
    }
  }, [tabList]);

  const myRef2 = useRef<HTMLDivElement>(null);

  const executeScroll = (scrollOffset: number) => {
    scrollerRef.current!.scrollLeft += scrollOffset;
  };

  return (
    <div
      id='mainArea'
      className={`${width < 768 ? 'main-area-collapsed' : 'main-area'}`}
    >
      <div id='tabs-parent' ref={myRef2} style={{ position: 'relative' }}>
        {tabList.length > 1 && scrollOne && (
          <div
            className={`tabs-scroller ${darkMode ? 'dark' : 'bright'}`}
            style={{
              left: 0,
            }}
            onClick={() => executeScroll(-200)}
          >
            <CgChevronLeft />
          </div>
        )}
        {tabList.length > 1 && scrollOne && (
          <div
            className={`tabs-scroller ${darkMode ? 'dark' : 'bright'}`}
            style={{
              right: 0,
            }}
            onClick={() => executeScroll(200)}
          >
            <CgChevronRight />
          </div>
        )}
        <div id='tabs' ref={scrollerRef}>
          {tabList &&
            tabList.map((tab, i) => (
              <div
                className={`tab ${darkMode ? 'dark' : 'bright'}`}
                key={tab.key}
                hidden={tab.key === 0 ? true : false}
                style={{
                  backgroundColor:
                    activeTab === tab.key ? '#f8f8f8' : '#e8e8e8',
                }}
              >
                <span
                  style={{ marginRight: '15px' }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.component.replace(/_/g, ' ')}
                </span>{' '}
                <span onClick={() => handleDelete(tab.id)}>
                  <IoIosClose size={20} />
                </span>
              </div>
            ))}
        </div>
      </div>
      {tabList.map((tab) => (
        <div
          key={tab.key}
          hidden={activeTab !== tab.key}
          style={{ minHeight: '100%' }}
        >
          <FormIdContext.Provider value={tab.formId}>
            <Routes>
              <Route
                path='/'
                element={
                  <Suspense fallback={<>...</>}>
                    {COMPONENT_MAP[tab.component] ? (
                      COMPONENT_MAP[tab.component]
                    ) : (
                      <div
                        className={darkMode ? 'dark' : 'bright'}
                        style={{
                          minHeight: 'calc(100vh  - 155px)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <h5>Oops..., Component is not defined yet</h5>
                      </div>
                    )}
                  </Suspense>
                }
              />
              <Route path='*' element={<NotFoundV2 />} />
            </Routes>
          </FormIdContext.Provider>
        </div>
      ))}
    </div>
  );
}
