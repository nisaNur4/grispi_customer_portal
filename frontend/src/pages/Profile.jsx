import React, {useState,useEffect,useCallback} from 'react';
import {Card,Form,Input, Button, Typography, Space, message,
  Row, Col, Avatar,Alert, Spin,Tabs, Divider, Select
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
  InfoCircleOutlined, 
  LoadingOutlined,
  ClockCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
const {Title,Text } = Typography;
const {Option}=Select;

const Profile = () => {
  const { user,logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [editing, setEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [form]=Form.useForm();
  const [addressForm]=Form.useForm();
  const [passwordForm]=Form.useForm();

  const fetchProfile = useCallback(async()=>{
    setLoading(true);
    try {
      const res = await api.get('/user/profile');
      if (res.data?.success) {
        const userData = res.data.data;
        setProfile(userData);

        form.setFieldsValue({
          ad: userData.ad || '',
          soyad: userData.soyad || '',
          email: userData.email || '',
          telefon: userData.telefon || '',
          webSitesi: userData.webSitesi || '',
        });

        addressForm.setFieldsValue({
          adres: userData.adres || '',
          ulke: userData.ulke || '',
          sehir: userData.sehir || '',
          postaKodu: userData.postaKodu || '',
        });
      } else {
        message.error(res.data?.message || 'Profil getirilemedi.');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Profil bilgileri alınırken bir hata oluştu.');
      if (error.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  }, [form, addressForm, logout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateGeneral=async (values)=> {
    setSaving(true);
    try {
      console.log("Genel Bilgiler Güncelleniyor:", values); 
      const res = await api.put('/user/profile', values);
      if (res.data?.success) {
        message.success('Profil başarıyla güncellendi.');
        setEditing(false);
        fetchProfile();
      } else {
        message.error(res.data?.message || 'Profil güncellenirken hata oluştu.');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };
   const handleUpdateSettings = async (values) => {
    setSaving(true);
    try {
      console.log("Ayarlar Güncelleniyor:", values); 
      const res = await api.put('/user/settings', values);

      if (res.data?.success) {
        message.success('Ayarlar başarıyla güncellendi.');
        fetchProfile();
      } else {
         message.error(res.data?.message || 'Ayarlar güncellenirken hata oluştu.');
      }

    } catch (error) {
      message.error(error.response?.data?.message || 'Ayarlar güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAddress = async (values) => {
    setSaving(true);
    try {
      const res = await api.put('/user/profile', values);
      if (res.data?.success) {
        message.success('Adres başarıyla güncellendi.');
        setEditingAddress(false);
        fetchProfile();
      } else {
        message.error(res.data?.message || 'Adres güncellenirken hata oluştu.');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Adres güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword =async(values)=> {
    setPasswordLoading(true);
    try {
      console.log("Şifre Değiştiriliyor:", values);

      const res = await api.put('/user/change-password', {
        currentPassword: values.mevcutSifre,
        newPassword: values.yeniSifre,
      });
      if (res.data?.success) {
        message.success('Şifreniz başarıyla değiştirildi.');
        passwordForm.resetFields();
      } else {
        message.error(res.data?.message || 'Şifre değiştirilirken hata oluştu.');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getUserInitials= (name) =>{
    if (!name) return"GG";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] + (name.length > 1 ? name[1] : '')).toUpperCase();
 
  };


  if (loading) {
    return (
      <div className="flex-center loading-profile-container" style={{ minHeight: '80vh', display:'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin indicator={<LoadingOutlined style={{fontSize:48}} spin />} />
        <Text className="loading-profile-text" style={{marginTop:16 }}>Profil yükleniyor...</Text>
      </div>
    );
  }
const tabItems = [
    {
      key: 'talepler',
      label: `Talepler (0)`,
      children: (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Text type="secondary">Atandığı Talepler</Text>
          <Divider />
          <table style={{width:"100%", textAlign:"left", borderCollapse: 'collapse', border: '1px solid #f0f0f0'}}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>Talep No</th>
                <th style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>Konu</th>
                <th style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>Talep Eden</th>
                <th style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>Oluşturulma Tarihi</th>
                <th style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>Durum</th>
                <th style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} style={{textAlign:"center", padding:48, borderTop: '1px solid #f0f0f0'}}>
                  <div style={{ color: '#aaa' }}>Veri Yok</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      key: 'kullanici-imzasi',
      label: 'Kullanıcı İmzası',
      children: (
        <div style={{ padding: 24 }}>
          <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
            İmzanız eğer kurumunuz kendi imzasını eklemiş ve sizin imzanıza bir yer belirlemişse orada yer alır. Taleplere yazdığınız yorumlarda talep edene otomatik gönderilir.
          </Text>
          <Title level={5} style={{ marginBottom: 16 }}>Kullanıcı İmzası</Title>
          <Card bodyStyle={{ minHeight: 200, padding: 8 }}>
            <div style={{ border: '1px solid #d9d9d9', minHeight: 180, padding: 8, borderRadius: 4, background: '#fff' }}>
                <Text type="secondary">Burada bir Rich Text Editor (örneğin Quill veya TinyMCE) bulunacak.</Text>
            </div>
          </Card>
          
          <Divider orientation="left" style={{ margin: '24px 0 16px' }}>İmza Bilgi Alanları</Divider>
          <Space wrap size="small">
            <Button size="small" style={{ borderColor: '#d9d9d9', color: '#595959' }}>Kurum adı</Button>
            <Button size="small" style={{ borderColor: '#d9d9d9', color: '#595959' }}>Kurum logosu</Button>
            <Button size="small" style={{ borderColor: '#d9d9d9', color: '#595959' }}>Kullanıcı telefonu</Button>
            <Button size="small" style={{ borderColor: '#d9d9d9', color: '#595959' }}>Kullanıcı adı</Button>
            <Button size="small" style={{ borderColor: '#d9d9d9', color: '#595959' }}>Kullanıcı dili</Button>
            <Button size="small" style={{ borderColor: '#d9d9d9', color: '#595959' }}>Kullanıcı e-postası</Button>
          </Space>
        </div>
      ),
    },
    {
      key: 'kullanici-ayarlari',
      label: 'Kullanıcı Ayarları',
      children: (
        <div style={{ padding: 24 }}>
          <Title level={5}>Ayarlar</Title>
          <Form form={addressForm} layout="vertical" onFinish={handleUpdateSettings}>
            <Form.Item name="dil" label="Dil" initialValue={profile?.dil || "Türkçe - Türkiye"}>
              <Input placeholder="Dil seçimi" disabled={saving} /> 
            </Form.Item>
            <Form.Item name="zamanDilimi" label="Zaman Dilimi" initialValue="GMT+3 (İstanbul)">
              <Input prefix={<ClockCircleOutlined />} placeholder="Zaman Dilimi" disabled={saving} />
            </Form.Item>

            <Divider orientation="left" style={{ margin: '24px 0 16px' }}>Adres Bilgileri</Divider>
            <Form.Item name="adres" label="Adres">
              <Input.TextArea placeholder="Adres bilgileriniz" rows={3} disabled={saving} />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="ulke" label="Ülke">
                  <Input placeholder="Ülke giriniz" disabled={saving} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="sehir" label="Şehir">
                  <Input placeholder="Şehir giriniz" disabled={saving} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="postaKodu" label="Posta Kodu">
              <Input placeholder="Posta kodu giriniz" disabled={saving} />
            </Form.Item>
            <Space style={{ marginTop: 24 }}>
              <Button onClick={() => addressForm.resetFields()}>Değişiklikleri geri al</Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                Değişiklikleri kaydet
              </Button>
            </Space>
          </Form>
        </div>
      ),
    },
    {
      key: 'guvenlik-ayarlari',
      label: 'Güvenlik Ayarları',
      children: (
        <div style={{ padding: 24 }}>
          <Title level={5}>Parola Sıfırlama</Title>
          <Card bodyStyle={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary">E-posta yoluyla parolanızı sıfırlamak için tıklayın</Text>
            <Button type="primary">Parola sıfırlama linki</Button>
          </Card>
          
          <Divider style={{ margin: '30px 0 20px 0' }} />

          <Title level={5}>Şifre Güncelleme</Title>
          <Alert
            message="Güvenlik Uyarısı"
            description="Şifrenizi güçlü tutun. En az 8 karakter içermelidir."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: 24 }}
          />
          <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
            <Form.Item name="mevcutSifre" label="Mevcut Şifre" rules={[{ required: true, message: 'Mevcut şifrenizi girin.' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Mevcut şifreniz" size="large" />
            </Form.Item>
            <Form.Item
              name="yeniSifre"
              label="Yeni Şifre"
              rules={[{ required: true, message: 'Yeni şifrenizi girin.' }, { min: 8, message: 'En az 8 karakter olmalı.' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Yeni şifreniz" size="large" />
            </Form.Item>
            <Form.Item
              name="yeniSifreTekrar"
              label="Yeni Şifreyi Tekrar"
              dependencies={['yeniSifre']}
              rules={[
                { required: true, message: 'Yeni şifrenizi tekrar girin.' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('yeniSifre') === value) return Promise.resolve();
                    return Promise.reject(new Error('Girdiğiniz şifreler eşleşmiyor!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Yeni şifrenizi tekrar girin" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<CheckOutlined />} htmlType="submit" loading={passwordLoading}>
                {passwordLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container profile-page" style={{ padding: 24, display: 'flex', gap: 24, background: '#f0f2f5' }}>

      <Card 
        style={{ 
          flexShrink: 0, 
          width: 300, 
          borderRadius: 8, 
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}
        className="user-profile-card"
      >
        <div style={{ textAlign: 'center', paddingBottom: 16 }}>
          <Avatar size={80} style={{ backgroundColor: '#6A1B9A', marginBottom: 16 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '40px' }}>
              {getUserInitials(profile?.ad + " " + profile?.soyad)}
            </Text>
          </Avatar>
          <Title level={4} style={{ margin: 0 }}>{profile?.ad} {profile?.soyad}</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Rol: {profile?.rol || 'Yönetici'}</Text>
        </div>
        
        <Divider style={{ margin: '16px 0' }} />

        <Form form={form} layout="vertical" onFinish={handleUpdateGeneral} disabled={!editing}>
          
          <Form.Item name="ad" label={<Text strong>Ad Soyad</Text>}>
            <Input value={`${profile?.ad || ''} ${profile?.soyad || ''}`} prefix={<UserOutlined />} disabled={true}/>
            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                {editing ? 'Ad ve soyadı düzenlemek için lütfen ilgili düzenleme alanını kullanın.' : ''}
            </Text>
          </Form.Item>
          
          <Form.Item label={<Text strong>Organizasyon Adı</Text>}>
            <Input value={profile?.organizasyon} disabled />
          </Form.Item>

          <Form.Item label={<Text strong>Gruplar</Text>}>
            <Input value={profile?.varsayilanGrup} disabled />
            <Button type="link" size="small" style={{ padding: 0, float: 'right', marginTop: -4 }}>Kullanıcının gruplarını yönet</Button>
          </Form.Item>
          <Divider style={{ margin: '8px 0' }}/>
          
          <Form.Item 
            label={<Text strong>Öncelikli Telefon</Text>}
            name="telefon"
            rules={[{ required: editing, message: "Telefon numarası girilmesi zorunludur" }]}
          >
            <PhoneInput
              country={'tr'}
              preferredCountries={['tr', 'us', 'gb']}
              enableSearch={editing}
              disabled={!editing}
              value={form.getFieldValue('telefon') || profile?.telefon}
              onChange={(value, data) => {
                form.setFieldsValue({ telefon: value });
              }}
              containerStyle={{ width: "100%" }}
              inputStyle={{ width: "100%", height: "40px", fontSize: "16px", borderRadius: "6px" }}
              buttonStyle={{ borderRadius: "6px 0 0 6px" }}
            />
          </Form.Item>
          {editing && (
            <Button type="link" size="small" icon={<PlusOutlined />} style={{ padding: 0, marginBottom: 16 }}>
              Telefon Ekle
            </Button>
          )}

          <Form.Item label={<Text strong>Öncelikli E-posta</Text>}>
            <Input value={profile?.oncelikliEposta} disabled />
            {editing && (
              <Button type="link" size="small" icon={<PlusOutlined />} style={{ padding: 0, marginTop: 4 }}>
                E-posta Ekle
              </Button>
            )}
          </Form.Item>
          
          <Card size="small" style={{ marginBottom: 16, background: '#fafafa', border: '1px solid #f0f0f0' }}>
            <Text type="secondary" style={{ display: 'block' }}>Sosyal Medya(G-Social) Alanları</Text>
          </Card>
          
          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
            <Button 
              onClick={() => {
                setEditing(false);
                form.resetFields();
                fetchProfile();
              }}
              disabled={!editing}
            >
              Değişiklikleri geri al
            </Button>
            <Button 
              type="primary" 
              icon={editing ? <SaveOutlined /> : <EditOutlined />} 
              onClick={() => {
                if (editing) {
                  form.submit();
                } else {
                  setEditing(true);
                }
              }}
              loading={saving}
            >
              {editing ? 'Değişiklikleri kaydet' : 'Düzenle'}
            </Button>
          </Space>
        </Form>
      </Card>

      <Card style={{ flex: 1, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <Tabs defaultActiveKey="talepler" items={tabItems} size="large" />
      </Card>
    </div>
  );
};

export default Profile;