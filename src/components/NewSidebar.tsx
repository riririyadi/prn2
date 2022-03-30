import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import Submenu from './Submenu';
import { AppCtx, ThemeCtx } from '../pages/Home';
import MainArea from './MainArea';
import { useWindowSize } from '../utils/useWindowSize';

export default function NewSidebar(props: any) {
  const [darkMode, setDarkMode] = useContext(ThemeCtx);
  const { width, height } = useWindowSize();

  const { menuData, showSideNav } = props;

  const { pathname } = useLocation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tabList, setTabList, activeTab, setActiveTab] =
    React.useContext(AppCtx);

  const handleAdd = (component: string, formId: number) => {
    if (pathname !== '/home') {
      return;
    }
    let id = tabList[tabList.length - 1].id + 1;
    setTabList([
      ...tabList,
      {
        key: id,
        id,
        component,
        formId,
      },
    ]);
    setActiveTab(tabList[tabList.length - 1].id + 1);
  };

  const executeScroll = () => {
    const scrollRefWidth = scrollerRef.current!.scrollWidth;
    scrollerRef.current!.scrollLeft += scrollRefWidth;
  };
  const firstRender = useRef(true);
  useEffect(() => {
    const storedTabListSize = localStorage.getItem('tablist_size');
    const storedTabList = storedTabListSize ? JSON.parse(storedTabListSize) : 1;

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (tabList.length > storedTabList) {
      executeScroll();
    }
    localStorage.setItem('tablist_size', JSON.stringify(tabList.length));
  }, [tabList]);
  return (
    <>
      <aside
        className={`${
          width > 768
            ? 'sidenav'
            : showSideNav
            ? 'sidenav-collapsed active'
            : 'sidenav-collapsed'
        }`}
      >
        {menuData &&
          menuData.map((m: any, i: number) => (
            <Submenu key={i} item={m} handleAdd={handleAdd} />
          ))}
      </aside>
      <MainArea scrollerRef={scrollerRef} />
    </>
  );
}
