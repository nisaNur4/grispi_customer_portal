import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await register(values);
      
      if (result.success) {
        message.success('Kayıt başarılı! Hoş geldiniz!');
        navigate('/talepler');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 16px rgba(24, 144, 255, 0.2)'
          }}>
            <span style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>G</span>
          </div>
          <Title level={2} style={{ margin: 0, color: '#222' }}>
            Grispi Portalı
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Yeni hesap oluşturun
          </Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="firstName"
              rules={[
                { required: true, message: 'Adınızı giriniz!' },
                { min: 2, message: 'Ad en az 2 karakter olmalıdır!' }
              ]}
              style={{ flex: 1 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Adınız"
                style={{ borderRadius: '8px', height: '48px' }}
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[
                { required: true, message: 'Soyadınızı giriniz!' },
                { min: 2, message: 'Soyad en az 2 karakter olmalıdır!' }
              ]}
              style={{ flex: 1 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Soyadınız"
                style={{ borderRadius: '8px', height: '48px' }}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email adresinizi giriniz!' },
              { type: 'email', message: 'Geçerli bir email adresi giriniz!' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Email adresiniz"
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { pattern: /^[\+]?[0-9\s\-\(\)]+$/, message: 'Geçerli bir telefon numarası giriniz!' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Telefon numaranız (opsiyonel)"
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="address"
          >
            <Input
              prefix={<HomeOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Adresiniz (opsiyonel)"
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Şifrenizi giriniz!' },
              { min: 6, message: 'Şifre en az 6 karakter olmalıdır!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Şifreniz"
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Şifrenizi tekrar giriniz!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Şifreler eşleşmiyor!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Şifrenizi tekrar giriniz"
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Kayıt Ol
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '24px 0' }}>
          <Text type="secondary">veya</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Zaten hesabınız var mı? </Text>
          <Link 
            to="/login" 
            style={{ 
              color: '#1890ff', 
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Giriş yapın
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register; 