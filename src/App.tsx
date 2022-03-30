import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RequireAuth from './utils/RequireAuth';
import { AuthProvider } from './utils/auth';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route
          path='home/*'
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
