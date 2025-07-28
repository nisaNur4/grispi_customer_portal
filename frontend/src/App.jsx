import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import tr_TR from 'antd/locale/tr_TR';
import './App.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import TalepOlustur from './pages/TalepOlustur';  
import TalepListesi from './pages/TalepListesi';  
import TalepDetay from './pages/TalepDetay';      
import Profile from './pages/Profile';

import UstMenu from './components/UstMenu';      

const { Content, Sider } = Layout;

function App() {
  return (
    <ConfigProvider locale={tr_TR}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Sider width={80} style={{ background: '#6C3FC5', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24 }}>
                  <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                    <span style={{ color: '#6C3FC5', fontWeight: 700, fontSize: 24 }}>G</span>
                  </div>
                </Sider>
                <Layout>
                  <UstMenu />
                  <Content style={{ padding: 0, minHeight: 'calc(100vh - 72px)' }}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/talepler" replace />} />
                      <Route path="/talep-olustur" element={<TalepOlustur />} />
                      <Route path="/talepler" element={<TalepListesi />} />
                      <Route path="/talep/:id" element={<TalepDetay />} />
                      <Route path="/profil" element={<Profile />} />
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  );
}
export default App;
