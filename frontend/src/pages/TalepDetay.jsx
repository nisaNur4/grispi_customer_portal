import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Tag, 
  Button, 
  Typography, 
  Space, 
  Divider,
  Avatar,
  Input,
  Row,
  Col,
  Timeline,
  Spin,
  Empty,
  message
} from 'antd';
import { 
  UserOutlined, 
  ArrowLeftOutlined,
  SendOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const TalepDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [talep, setTalep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/ticket/${id}`)
      .then(res => {
        if (res.data && res.data.success) {
          setTalep(res.data.data);
        } else {
          setTalep(null);
        }
      })
      .catch(() => {
        setTalep(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const durumRengi = (durum) => {
    switch (durum) {
      case 'Açık': return 'blue';
      case 'İşlemde': return 'orange';
      case 'Beklemede': return 'yellow';
      case 'Çözüldü': return 'green';
      case 'Kapalı': return 'default';
      default: return 'default';
    }
  };

  const oncelikRengi = (oncelik) => {
    switch (oncelik) {
      case 'Acil': return 'red';
      case 'Yüksek': return 'orange';
      case 'Normal': return 'blue';
      case 'Düşük': return 'green';
      default: return 'default';
    }
  };

  const durumIconu = (durum) => {
    switch (durum) {
      case 'Açık': return <ExclamationCircleOutlined />;
      case 'İşlemde': return <ClockCircleOutlined />;
      case 'Beklemede': return <ClockCircleOutlined />;
      case 'Çözüldü': return <CheckCircleOutlined />;
      case 'Kapalı': return <FileTextOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      message.warning('Lütfen bir mesaj yazın');
      return;
    }
    setSending(true);
    try {
      const res = await axios.post(`/api/ticket/${id}/message`, {
        mesaj: newMessage
      });
      if (res.data && res.data.success) {
        setTalep(res.data.data);
        setNewMessage('');
        message.success('Mesaj gönderildi');
      } else {
        message.error('Mesaj gönderilemedi');
      }
    } catch (err) {
      message.error('Mesaj gönderilemedi');
    }
    setSending(false);
  };

  const renderAttachments = (dosyalar) => {
    if (!dosyalar || dosyalar.length === 0) return null;
    return (
      <div className="attachment-list">
        {dosyalar.map((file, idx) => (
          <div className="attachment-item" key={idx}>
            <FileTextOutlined style={{ color: '#1890ff', fontSize: 16 }} />
            <span>{file}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!talep) {
    return (
      <div className="empty-container">
        <Empty description="Talep bulunamadı" />
        <Button onClick={() => navigate('/talepler')}>
          Taleplere Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <Button
            icon={<ArrowLeftOutlined style={{ fontSize: 18 }} />}
            onClick={() => navigate('/talepler')}
            style={{ borderRadius: 8, fontWeight: 500, fontSize: 15, height: 44 }}
          >
            Geri Dön
          </Button>
          <Space>
            <Tag color={durumRengi(talep.durum)} icon={durumIconu(talep.durum)} style={{ fontSize: 14, borderRadius: 6, padding: '2px 14px' }}>
              {talep.durum}
            </Tag>
            <Tag color={oncelikRengi(talep.oncelik)} style={{ fontSize: 14, borderRadius: 6, padding: '2px 14px' }}>
              {talep.oncelik}
            </Tag>
          </Space>
        </div>
        <span className="page-title" style={{ fontSize: 22, fontWeight: 600, color: '#222', marginBottom: 6 }}>{talep.baslik}</span>
        <div className="page-subtitle" style={{ fontSize: 15, color: '#8c8c8c' }}>
          Talep No: {talep.talepNumarasi} • {dayjs(talep.createdAt).format('DD/MM/YYYY HH:mm')}
        </div>
      </div>

      <Row gutter={32}>
        {/*Talep Bilgileri*/}
        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 600, fontSize: 17, color: '#222' }}>Talep Bilgileri</span>} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 24px rgba(24,144,255,0.08)', border: '1.5px solid #e8e8e8', padding: '24px 20px 16px 20px' }}>
            <Descriptions column={1} size="small" labelStyle={{ fontWeight: 500, color: '#8c8c8c', fontSize: 14 }} contentStyle={{ fontSize: 15, color: '#222' }}>
              <Descriptions.Item label="Talep No">
                <Text strong>{talep.talepNumarasi}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Durum">
                <Tag color={durumRengi(talep.durum)} icon={durumIconu(talep.durum)} style={{ fontSize: 14, borderRadius: 6, padding: '2px 14px' }}>
                  {talep.durum}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Öncelik">
                <Tag color={oncelikRengi(talep.oncelik)} style={{ fontSize: 14, borderRadius: 6, padding: '2px 14px' }}>
                  {talep.oncelik}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Kategori">
                <Tag style={{ fontSize: 14, borderRadius: 6, padding: '2px 14px' }}>{talep.kategori}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Oluşturulma Tarihi">
                {dayjs(talep.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Son Güncelleme">
                {dayjs(talep.sonGuncelleme).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
            {/*Dosya ekleri*/}
            {renderAttachments(talep.dosyalar)}
          </Card>

          <Card title={<span style={{ fontWeight: 600, fontSize: 17, color: '#222' }}>Talep Açıklaması</span>} style={{ borderRadius: 12, boxShadow: '0 4px 24px rgba(24,144,255,0.08)', border: '1.5px solid #e8e8e8', padding: '24px 20px 16px 20px' }}>
            <Paragraph style={{ lineHeight: 1.6, fontSize: 15, color: '#222' }}>
              {talep.aciklama}
            </Paragraph>
          </Card>
        </Col>

        {/*Mesajlaşma */}
        <Col xs={24} lg={16}>
          <Card 
            title={<span style={{ fontWeight: 600, fontSize: 17, color: '#222' }}>Mesajlar</span>}
            extra={
              <Text type="secondary" style={{ fontSize: 14 }}>
                {talep.mesajlar.length} mesaj
              </Text>
            }
            bodyStyle={{ padding: 0, borderRadius: 12 }}
            style={{ borderRadius: 12, boxShadow: '0 4px 24px rgba(24,144,255,0.08)', border: '1.5px solid #e8e8e8', minHeight: 400 }}
          >
            {/* Mesaj listesi */}
            <div className="message-container" style={{ maxHeight: 400, padding: '18px 8px 18px 8px', background: '#f7faff', borderRadius: 12 }}>
              {talep.mesajlar.length > 0 ? (
                <Timeline
                  style={{ padding: '0 0 0 0' }}
                  items={talep.mesajlar.map((mesaj, index) => ({
                    children: (
                      <div className={`message-item ${mesaj.gonderen === 'Kullanıcı' ? 'user' : 'support'}`} style={{ fontSize: 15, borderRadius: 16, marginBottom: 18, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <Avatar 
                            icon={<UserOutlined />} 
                            style={{ 
                              backgroundColor: mesaj.gonderen === 'Kullanıcı' ? '#1890ff' : '#52c41a',
                              flexShrink: 0,
                              width: 36,
                              height: 36
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <Text strong style={{ color: mesaj.gonderen === 'Kullanıcı' ? '#1890ff' : '#52c41a', fontSize: 15 }}>
                                {mesaj.gonderen}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                {dayjs(mesaj.gondermeTarihi).format('DD/MM/YYYY HH:mm')}
                              </Text>
                            </div>
                            <Paragraph style={{ margin: 0, lineHeight: 1.5, fontSize: 15, color: '#222' }}>
                              {mesaj.mesaj}
                            </Paragraph>
                          </div>
                        </div>
                      </div>
                    )
                  }))}
                />
              ) : (
                <div style={{ padding: 32, textAlign: 'center' }}>
                  <Empty 
                    description="Henüz mesaj yok" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              )}
            </div>

            {/* Mesaj gönderme alanı*/}
            <Divider style={{ margin: 0 }} />
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <TextArea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  rows={3}
                  style={{ flex: 1, borderRadius: 8, fontSize: 15, minHeight: 44 }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined style={{ fontSize: 18 }} />}
                  onClick={handleSendMessage}
                  loading={sending}
                  disabled={!newMessage.trim()}
                  style={{ borderRadius: 8, fontWeight: 600, fontSize: 16, height: 44, minWidth: 120 }}
                >
                  Gönder
                </Button>
              </div>
              <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                Enter tuşu ile gönder, Shift+Enter ile yeni satır
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
      <div style={{ height: 24 }} />
    </div>
  );
};

export default TalepDetay;