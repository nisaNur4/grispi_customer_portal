import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space, 
  message, 
  Row, 
  Col, 
  Avatar, 
  Alert,
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EditOutlined, 
  SaveOutlined, 
  CloseOutlined,
  LockOutlined,
  CheckOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import api from '../utils/axios';

const { Title, Text, Link } = Typography;

const sectionStyle = {
  padding: '16px 0',
  borderBottom: '1px solid #f0f0f0',
  marginBottom: 16
};

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/profile');
      if (res.data?.success) {
        const userData = res.data.data;
        setUser(userData);
        form.setFieldsValue({
          ad: userData.ad || '',
          soyad: userData.soyad || '',
          email: userData.email || '',
          telefon: userData.telefon || '',
          adres: userData.adres || '',
          ulke: userData.ulke || '',
          sehir: userData.sehir || '',
          postaKodu: userData.postaKodu || '',
          webSitesi: userData.webSitesi || ''
        });
      }
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
      message.error('Profil bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const res = await api.put('/user/profile', values);
      if (res.data?.success) {
        message.success('Profil başarıyla güncellendi');
        setUser(prev => ({ ...prev, ...values }));
        setEditing(false);
      } else {
        message.error('Profil güncellenirken bir hata oluştu');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setPasswordLoading(true);
    try {
      const res = await api.put('/user/password', values);
      if (res.data?.success) {
        message.success('Şifre başarıyla değiştirildi');
        passwordForm.resetFields();
      } else {
        message.error('Şifre değiştirilirken bir hata oluştu');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = (ad, soyad) => `${ad?.[0] || ''}${soyad?.[0] || ''}`.toUpperCase();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Avatar size={64} icon={<UserOutlined />} />
        <div style={{ marginTop: 16 }}>
          <Text>Profil yükleniyor...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className='table-container' style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>

          <Avatar 
            size={80} 
            style={{ backgroundColor: '#6a1b9a', fontSize: '32px', marginRight: 16 }}
          >
            {getInitials(user?.ad, user?.soyad)}
          </Avatar>
          <div>
            <Title level={3} style={{ marginBottom: 0 }}>
              {user?.ad} {user?.soyad}
            </Title>
            <Text type="secondary">{user?.email}</Text>
          </div>
        </div>

      <Card style={{ marginBottom: 24 }}>
        <div className="flex-between" style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            <UserOutlined style={{ marginRight: 8 }} />
            Kişisel Bilgiler
          </Title>
          <Space>
            {editing ? (
              <>
                <Button className='save-btn'
                  icon={<CloseOutlined />} 
                  onClick={() => {
                    setEditing(false);
                    form.resetFields();
                  }}
                >
                  İptal
                </Button>
                <Button className='save-btn'
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={() => form.submit()}
                  loading={saving}
                >
                  Kaydet
                </Button>
              </>
            ) : (
              <Button className='save-btn' icon={<EditOutlined />} onClick={() => setEditing(true)}>
                Düzenle
              </Button>
            )}
          </Space>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSave} disabled={!editing}>
          <section style={sectionStyle}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="ad" label="Ad" rules={[{ required: true, message: 'Adınızı girin' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Adınız" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="soyad" label="Soyad" rules={[{ required: true, message: 'Soyadınızı girin' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Soyadınız" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="telefon" label="Telefon">
                  <Input addonBefore="+90" prefix={<PhoneOutlined />} placeholder="5XX XXX XX XX" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email" label="E-posta" rules={[{ type: 'email', message: 'Geçerli bir e-posta girin' }]}>
                  <Input prefix={<MailOutlined />} placeholder="ornek@email.com" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="webSitesi" label="Web Sitesi (Opsiyonel)">
              <Input placeholder="https://..." />
            </Form.Item>
          </section>

          <section style={sectionStyle}>
            <Form.Item name="adres" label="Adres">
              <Input.TextArea placeholder="Adres bilgileriniz" rows={3} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="ulke" label="Ülke">
                  <Input placeholder="Ülke giriniz" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="sehir" label="Şehir">
                  <Input placeholder="Şehir giriniz" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="postaKodu" label="Posta Kodu">
                  <Input placeholder="Posta kodu giriniz" />
                </Form.Item>
              </Col>
            </Row>
          </section>
        </Form>
      </Card>

      <Card>
        <Title level={4} style={{ marginBottom: 24 }}>
          <LockOutlined style={{ marginRight: 8 }} />
          Şifre Değiştir
        </Title>
        <Alert
          message="Güvenlik Uyarısı"
          description="Şifrenizi güçlü tutun. En az 8 karakter içermelidir."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: 24 }}
        />
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item name="mevcutSifre" label="Mevcut Şifre" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mevcut şifreniz" size="large" />
          </Form.Item>
          <Form.Item name="yeniSifre" label="Yeni Şifre" rules={[{ required: true, min: 8 }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Yeni şifreniz" size="large" />
          </Form.Item>
          <Form.Item
            name="yeniSifreTekrar"
            label="Yeni Şifre Tekrar"
            dependencies={['yeniSifre']}
            rules={[
              { required: true, message: 'yeni şifrenizi tekrar girin' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('yeniSifre') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Şifreler eşleşmiyor'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Yeni şifrenizi tekrar girin" size="large" />
          </Form.Item>
          <Button className='save-btn' type="primary" icon={<CheckOutlined />} htmlType="submit" loading={passwordLoading}>
            Şifreyi Değiştir
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
