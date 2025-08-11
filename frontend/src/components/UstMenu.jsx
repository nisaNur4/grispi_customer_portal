import React,{useState} from 'react';
import { Layout,Menu,Button,Typography,Dropdown,Badge,Tooltip } from 'antd';
import { UserOutlined,LogoutOutlined,BellOutlined,QuestionCircleOutlined,FileTextOutlined,PlusOutlined } from '@ant-design/icons';
import { useNavigate,useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const {Header}=Layout;
const {Text}=Typography;

const UstMenu=()=>{
  const navigate=useNavigate();
  const location=useLocation();
  const {user,logout}=useAuth();
  const [notificationCount]=useState(0);

  const handleLogout=()=>{
    logout();
    navigate('/login');
  };
  const userMenuItems=[
    {
      key:'grispi',
      icon:(
        <div style={{
          width:40,
          textAlign:'center',
          height:40,
          background:'#6A1B9A',
          borderRadius:'17px',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
        }}>
          <Text style={{
            color:'white',
            fontSize:'40px',
          }}>G</Text>
        </div>
      ),
      label:(
        <div>
          <div>
            <strong>
              {`${user?.ad || ''} ${user?.soyad||''}`.trim()}
            </strong>
          </div>
          <div style={{
            fontSize:'12px',
            color:'#999'
          }}>
            {user?.email||'eposta@example.com'}
          </div>
        </div>
      )
    },
    {
        type:'divider'
    },
    {
        key:'profile',
        icon:<UserOutlined style={{fontSize:'24px'}}/>,
        label:'Profil',
        onClick:()=>navigate('/profil')
    },
    {
      key:'help',
      icon:<QuestionCircleOutlined style={{fontSize:'24px'}}/>,
      label:'Yardım',
      onClick:()=>navigate('/yardim')
    },
    {
      type:'divider'
    },
    {
      key:'logout',
      icon:<LogoutOutlined style={{fontSize:'24px'}}/>,
      label:'Çıkış Yap',
      onClick: handleLogout
    }
  ];

  const notificationItems=[{}];
  return(
    <Header style={{
      background:'#f1f1f1',
      padding:'0 24px',
      height:'64px',
      lineHeight:'64px',
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between'
    }}>
      <div style={{
        display:'flex',
        alignItems:'center'
      }}>
        <Menu mode="horizontal" selectedKeys={[location.pathname]} style={{
          background:'transparent',
          border:'none'
        }}>
          <Menu.Item key="/talepler" icon={<FileTextOutlined/>} onClick={()=>navigate('/talepler')} className="custom-hover">
            Taleplerim
          </Menu.Item>
          <Menu.Item key="/talep-olustur" icon={<PlusOutlined/>} onClick={()=>navigate('/talep-olustur')} className="custom-hover">
            Yeni Talep
          </Menu.Item>
        </Menu>
      </div>
      <div style={{
        display:'flex',
        alignItems:'center',
        gap:'16px'
      }}>
        <Tooltip title="Bildirimler">
          <Dropdown menu={{
            items:notificationItems
          }}
          placement="bottomRight"
          trigger={['click']}>
            <Badge count={notificationCount} size="small">
              <Button type="text" icon={<BellOutlined style={{
                fontSize:'24px'
              }}/>} size="large" className="notification-btn" />
            </Badge>
          </Dropdown>
        </Tooltip>
        <Dropdown menu={{
          items:userMenuItems
        }} placement="bottomRight" trigger={['click']}>
          <div className="user-menu">
            <div style={{
              width:40,
              textAlign:'center',
              height:40,
              background:'#6A1B9A',
              borderRadius:'17px',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
            }}>
              <Text style={{
                color:'white',
                fontSize:'40px'
              }}>G</Text>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};


export default UstMenu; 