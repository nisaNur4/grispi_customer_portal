import React, {useEffect, useState} from 'react';
import { Card, Form, Input, Button, Row, Col, Avatar, Typography, Divider, Space,message, Spin } from 'antd';
import { UserOutlined,LockOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const { user, setUser } = useAuth();

  // Profil bilgilerini çek
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile');
        form.setFieldsValue({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address
        });
      } catch (err) {
        message.error('Profil bilgileri alınamadı');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [form]);

  // Profil güncelleme
  const handleSave = async (values) => {
    setSaving(true);
    try {
      const res = await axios.put('http://localhost:5000/api/users/profile', values);
      message.success('Profil başarıyla güncellendi');
      // Kullanıcı bilgilerini güncelle
      if (setUser) {
        setUser(res.data.user);
      }
    } catch (err) {
      message.error('Profil güncellenemedi');
    }
    setSaving(false);
  };

  // Şifre değiştirme
  const handlePasswordChange = async () => {
    const newPassword = form.getFieldValue('newPassword');
    const confirmPassword = form.getFieldValue('confirmPassword');
    if (!newPassword || !confirmPassword) {
      message.warning('Lütfen yeni şifre ve tekrarını girin');
      return;
    }
    if (newPassword !== confirmPassword) {
      message.warning('Şifreler uyuşmuyor');
      return;
    }
    setPasswordSaving(true);
    try {
      await axios.put('http://localhost:5000/api/users/change-password', { newPassword });
      message.success('Şifre başarıyla değiştirildi');
      form.resetFields(['newPassword', 'confirmPassword']);
    } catch (err) {
      message.error('Şifre değiştirilemedi');
    }
    setPasswordSaving(false);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Spin size="large" /></div>;
  }

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 120px)', background: 'var(--background)' }}>
      <Card style={{ maxWidth: 700, width: '100%', margin: '40px 0', borderRadius: 16, boxShadow: '0 4px 24px rgba(24,144,255,0.08)', padding: 32 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
            <Avatar size={80} icon={<UserOutlined />} style={{ background: '#6C3FC5', fontSize: 36, marginBottom: 12 }} />
            <Title level={4} style={{ marginBottom: 0 }}>{user?.firstName} {user?.lastName}</Title>
            <Text type="secondary">{user?.role || 'Kullanıcı'}</Text>
          </Col>
          <Col xs={24} sm={18}>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSave}
              initialValues={{
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                phone: user?.phone,
                address: user?.address
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Ad" name="firstName" rules={[{ required: true, message: 'Zorunlu alan' }]}> <Input size="large" style={{ borderRadius: 8 }}/></Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Soyad" name="lastName" rules={[{ required: true, message: 'Zorunlu alan' }]}> <Input size="large" style={{ borderRadius: 8 }}/></Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="E-posta" name="email" rules={[{ required: true, type: 'email', message: 'Geçerli e-posta girin' }]}> <Input size="large" style={{ borderRadius: 8 }}/></Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Telefon" name="phone"> <Input size="large" style={{ borderRadius: 8 }} /> </Form.Item>
                </Col>
              </Row>
              <Divider style={{ margin: '16px 0' }} />
              <Row gutter={16} align="middle">
                <Col xs={24} sm={12}>
                  <Form.Item label="Şifre Değiştir" style={{ marginBottom: 0 }}>
                    <Form.Item name="newPassword" noStyle>
                      <Input.Password size="large" prefix={<LockOutlined />} placeholder="Yeni Şifre" style={{ borderRadius: 8, marginBottom: 8 }} />
                    </Form.Item>
                    <Form.Item name="confirmPassword" noStyle>
                      <Input.Password size="large" prefix={<LockOutlined />} placeholder="Yeni Şifre (Tekrar)" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Button
                      type="default"
                      size="small"
                      style={{ marginTop: 8, borderRadius: 8 }}
                      loading={passwordSaving}
                      onClick={handlePasswordChange}
                    >Şifreyi Değiştir</Button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Adres" name="address"> <Input size="large" style={{ borderRadius: 8 }} /> </Form.Item>
                </Col>
              </Row>
              <Divider style={{ margin: '16px 0' }} />
              <Space style={{ width: '100%', justifyContent: 'flex-end', display: 'flex' }}>
                <Button size="large" style={{ borderRadius: 8, fontWeight: 500, fontSize: 15, height: 44, minWidth: 100 }} onClick={() => form.resetFields()}>Kapat</Button>
                <Button type="primary" icon={<SaveOutlined />} size="large" style={{ borderRadius: 8, fontWeight: 600, fontSize: 16, height: 44, minWidth: 120, background: '#6C3FC5', borderColor: '#6C3FC5' }} htmlType="submit" loading={saving}>Kaydet</Button>
              </Space>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Profile; 