import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Button, Card, Typography } from 'antd';
import tr_TR from 'antd/locale/tr_TR';
import Layout from 'antd/lib/layout';
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
const { Title, Text } = Typography;
const TestPage = () => (
  <div style={{ padding: '24px', textAlign: 'center' }}>
    <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Title level={2}>🎉 Grispi Portal Çalışıyor!</Title>
      <Text>Frontend başarıyla yüklendi. Şimdi giriş yapabilirsiniz.</Text>
      <br /><br />
      <Button type="primary" size="large" onClick={() => window.location.href = '/login'}>
        Giriş Yap
      </Button>
    </Card>
  </div>
);

const App = () => {
  return (
    <ConfigProvider 
      locale={tr_TR}
      theme={{
        token: {
          colorPrimary: '#6a1b9a',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Card: {
            borderRadius: 12,
          },
          Table: {
            borderRadius: 12,
          },
        },
      }}
    >
      <AuthProvider>
        <div className="page-container">
          <Routes>
            <Route path="/test" element={<TestPage />} />
                        <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Sidebar/>
                <Layout style={{marginLeft:75 }}>
                  <UstMenu />
                  <Content className="content-wrapper" style={{
                    marginTop:64,
                    padding:'24px',
                  }}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/talepler" replace />} />
                      <Route path="/talepler" element={<TalepListesi />} />
                      <Route path="/talep-olustur" element={<TalepOlustur />} />
                      <Route path="/talep/:id" element={<TalepDetay />} />
                      <Route path="/profil" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/talepler" replace />} />
                    </Routes>
                  </Content>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
