import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Alert, App as AntdApp } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

const { Title, Text, Paragraph } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { message } = AntdApp.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        message.success('Başarıyla giriş yapıldı.');
        navigate('/talepler'); 
      }
    } catch (error) {
      message.error(error.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
        <Card style={{ 
          maxWidth: '400px',
          width:'100%',
          borderRadius: '12px',
          boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div className="login-icon-box" >
              <LoginOutlined />
            </div>
            <Title level={2}>Hoş Geldiniz</Title>
            <Text type="secondary">Grispi Customer Portal'a Giriş Yapın</Text>
          </div>

          <Alert style={{background:"#e0baf8", borderColor:"#6A1B9A"}}
            message="Örnek Kullanıcı Bilgileri"
            description={
              <div>
                <Text strong>E-posta:</Text> grispi@grispi.com.tr
                <br />
                <Text strong>Şifre:</Text> 123456
              </div>
            }
            type="info"
            showIcon
            icon={<InfoCircleOutlined style={{ color: "#fff", fontSize: 20 }}/>}
          />
          <br />

          <Form form={form} layout="horizontal" onFinish={onFinish} size="large" labelCol={{span:6}} wrapperCol={{span:18}}>
            <Form.Item
              name="email"
              label="E-posta"
              rules={[
                { required: true, message: 'E-posta adresinizi girin.' },
                { type: 'email', message: 'Geçerli bir e-posta adresi girin.' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="ornek@email.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Şifre"
              rules={[
                { required: true, message: 'Şifrenizi girin' },
                { min: 6, message: 'Şifre en az 6 karakter olmalı' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Şifreniz" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<LoginOutlined />} style={{ width: '350px'}}>
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Paragraph>Hesabınız yoksa sistem yöneticisi ile iletişime geçin.</Paragraph>
            <Text type="secondary" style={{ fontSize: '12px' }}>Grispi Customer Portal</Text>
          </div>
        </Card>
    </div>
  );
};

export default Login;
