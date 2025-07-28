import React from 'react';
import { Layout, Menu, Avatar,Dropdown,Space, Button,Typography } from 'antd';
import { 
  PlusOutlined, 
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined
} from '@ant-design/icons';
import {useNavigate,useLocation} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const UstMenu = () => {
  const navigate = useNavigate();  // Sayfa yönlendirmesi için
  const location = useLocation();  // Mevcut sayfa bilgisi için
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: '/talepler',
      icon: <FileTextOutlined />,
      label: 'Taleplerim',
      onClick: () => navigate('/talepler')
    },
    {
      key: '/talep-olustur',
      icon: <PlusOutlined />,
      label: 'Yeni Talep',
      onClick: () => navigate('/talep-olustur')
    }
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
      onClick: () => navigate('/profil')  
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
      onClick: () => console.log('Ayarlar tıklandı')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıkış Yap',
      onClick: () => {
        logout();
        navigate('/login');
      }
    }
  ];

  return (
    <Header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#fff',
      padding: '0 40px',
      boxShadow: '0 2px 12px rgba(24,144,255,0.06)',
      borderBottom: '1.5px solid #e8e8e8',
      height: '72px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '14px',
        minWidth: 220
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '22px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(24,144,255,0.10)'
        }}>
          G
        </div>
        <div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 700, 
            color: '#222',
            lineHeight: '1.2',
            letterSpacing: '0.5px'
          }}>
            Grispi Müşteri Portalı
          </div>
          <div style={{ 
            fontSize: '13px', 
            color: '#8c8c8c',
            lineHeight: '1.2',
            fontWeight: 500
          }}>
            Müşteri Destek Sistemi
          </div>
        </div>
      </div>
      
      {/*Navigasyon menüsü */}
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ 
          border: 'none',
          background: 'transparent',
          flex: 1,
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 600,
          gap: 32
        }}
      />

      {/*Kullanıcı menüsü ve bildirimler*/}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '20px',
        minWidth: 180,
        justifyContent: 'flex-end'
      }}>
        {/* Bildirimler*/}
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 22 }} />}
          style={{ 
            width: '44px', 
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f7faff',
            boxShadow: '0 2px 8px rgba(24,144,255,0.06)'
          }}
          onClick={() => console.log('Bildirimler tıklandı')}
        />

        {/* Kullanıcı menüsü*/}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '8px',
            transition: 'background-color 0.2s',
            background: '#f7faff',
            boxShadow: '0 2px 8px rgba(24,144,255,0.06)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f7ff'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f7faff'}
          >
            <Avatar 
              icon={<UserOutlined />} 
              size={36}
              style={{ backgroundColor: '#1890ff', fontSize: 20 }}
            />
            <Space direction="vertical" size={0} style={{ lineHeight: '1.2' }}>
              <Text style={{ fontSize: '15px', fontWeight: 600, color: '#222' }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}
              </Text>
              <Text style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 500 }}>
                {user ? user.email : 'Müşteri'}
              </Text>
            </Space>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};
export default UstMenu; 