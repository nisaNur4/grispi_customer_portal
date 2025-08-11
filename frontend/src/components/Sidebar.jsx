import React from 'react';
import {Layout,Menu} from 'antd';
import {HomeFilled,SettingFilled,} from '@ant-design/icons';
import {Link} from 'react-router-dom';

const {Sider}=Layout;
const Sidebar=()=>(
    <Sider width={75} style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: '#6A1B9A',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        padding:'16px 8px',
        boxSizing:'border-box',
        justifyContent:'space-between'
        }}>
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FFE066, #FF6F00)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '8px 0 24px 0',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}>
            <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                lineHeight: '13px',
                textAlign: 'center',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}>
                yolcu<br />360°
            </span>
        </div>

        <Menu theme="dark" mode="vertical" style={{
            background:'transparent', 
            borderRight: 0,
            width:'100%',
            display: 'flex',
            flexDirection:'column',
            alignItems:'center',
            gap:'8px',
        }}inlineIndent={0}>
            <Menu.Item key="home" style={{
                height: '56px',
                width:'100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding:0
                }}
                icon={<HomeFilled style={{
                    fontSize:'32px',
                    color:'white'
                }}/>}>
                    <Link to="/"/>
            </Menu.Item>
            <Menu.Item
                key="settings"
                style={{
                height: '56px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding:0,
                }}
                icon={<SettingFilled style={{ fontSize: '32px', color: 'white' }} />}
            >
                <Link to="/settings" />
            </Menu.Item>
        </Menu>
    </Sider>
);

export default Sidebar;
