import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { App as AntdApp, ConfigProvider, Layout } from 'antd';
import tr_TR from 'antd/locale/tr_TR';

import UstMenu from './components/UstMenu';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import TalepOlustur from './pages/TalepOlustur';
import TalepListesi from './pages/TalepListesi';
import TalepDetay from './pages/TalepDetay';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';

import './App.css';

const { Content } = Layout;

const AppLayout = () => (
  <Layout className="main-layout">
    <Sidebar />
    <Layout>
      <UstMenu />
      <Content className="content-wrapper">
        <Outlet />
      </Content>
    </Layout>
  </Layout>
);

const App = () => (
  <ConfigProvider
    locale={tr_TR}
    theme={{
      token: {
        colorPrimary: '#6a1b9a',
        borderRadius: 8,
        controlHeight: 40,
      },
      components: {
        Card: {
          borderRadius: 12,
        },
        Table: {
          borderRadius: 12,
        },
      },
    }}
  >
    <AntdApp>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/talepler" replace />} />
            <Route path="talepler" element={<TalepListesi />} />
            <Route path="talep-olustur" element={<TalepOlustur />} />
            <Route path="talep/:id" element={<TalepDetay />} />
            <Route path="profil" element={<Profile />} />
            <Route path="*" element={<Navigate to="/talepler" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </AntdApp>
  </ConfigProvider>
);

export default App;
