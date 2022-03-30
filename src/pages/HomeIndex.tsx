import React, { useEffect, useState, useContext } from 'react';
import { AppCtx } from '../pages/Home';

export default function HomeIndex() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 110px)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        alt='logo'
        src='https://1.bp.blogspot.com/-mNPimefwIZ0/YSBq-YRfuqI/AAAAAAAATVA/PCnhqCvEn-cGkgYtSZeVDntnKWJJqT7NwCLcBGAsYHQ/s320/Telkomsel%2BTerbaru.png'
      />
    </div>
  );
}
