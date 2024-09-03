// components/Layout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login';

  return (
    <div>
      {!hideHeader && <Header />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
