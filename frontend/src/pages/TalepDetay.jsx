import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row, Col, Card, Tabs, List, Avatar, Input, Button, Upload, Descriptions, Tag,
  Badge, Timeline, Progress, Empty, Spin, message, Tooltip, Space, Divider, Alert, Typography
} from 'antd';
import {
  ArrowLeftOutlined, SendOutlined, FileTextOutlined, PaperClipOutlined, DownloadOutlined,
 UserOutlined, UploadOutlined, MessageOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../utils/axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ornek_talep = {
  _id: '12',
  baslik: "Hesaba Giriş Yapamıyorum",
  aciklama: "Merhaba, giriş bilgilerimle giriş yapamıyorum. 'Invalid username or password' hatası alıyorum.",
  durum: 'Beklemede',
  oncelik: 'Düşük',
  kategori: 'category1',
  olusturmaTarihi: '2025-01-24T09:12:00Z',
  guncellemeTarihi: '2025-02-15T14:30:00Z',
  owner: { name: 'Test Customer 1' },
  assignee: { name: 'Az' },
  takipciler: [{ name: 'Takipçi 1' }],
  mesajlar: [
    { sender: 'customer', name: 'Customer 1', tarih: '2025-02-15T10:00:00Z', mesaj: "Merhaba, hesabıma giriş yapamıyorum..." },
    { sender: 'support', name: 'Az', tarih: '2025-02-15T12:00:00Z', mesaj: 'Talep beklemede, lütfen ek bilgi sağlayın.' }
  ],
  dosyalar: [
    { name: 'error-screenshot.png', url: '#' }
  ]
};

export default function TalepDetay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [talep, setTalep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [fileList, setFileList] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTalep();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [talep?.mesajlar]);

  const normalizeTicket = (raw) => {
    return {
      _id: raw._id || raw.id || raw.ticketId || 'unknown',
      baslik: raw.baslik || raw.title || raw.subject || 'Başlık yok',
      aciklama: raw.aciklama || raw.description || raw.body || '',
      durum: raw.durum || raw.status || 'Açık',
      oncelik: raw.oncelik || raw.priority || 'Normal',
      kategori: raw.kategori || raw.category || 'Genel',
      olusturmaTarihi: raw.olusturmaTarihi || raw.createdAt || raw.created_at || null,
      guncellemeTarihi: raw.guncellemeTarihi || raw.updatedAt || raw.updated_at || null,
      owner: raw.owner || raw.requester || { name: raw.requesterName || 'Bilinmiyor' },
      assignee: raw.assignee || raw.atanan || { name: raw.assigneeName || 'Bilinmiyor' },
      takipciler: raw.followers || raw.takipciler || raw.cc || [],
      mesajlar: Array.isArray(raw.mesajlar) ? raw.mesajlar.map(m => ({
        sender: m.sender || (m.userType === 'support' ? 'support' : 'customer'),
        name: m.name || m.author || m.from || (m.sender === 'support' ? 'Destek' : 'Müşteri'),
        tarih: m.tarih || m.createdAt || m.created_at || new Date().toISOString(),
        mesaj: m.mesaj || m.body || m.content || ''
      })) : (Array.isArray(raw.messages) ? raw.messages.map(m => ({
        sender: m.sender || (m.userType === 'support' ? 'support' : 'customer'),
        name: m.name || m.author || m.from,
        tarih: m.createdAt || m.tarih || new Date().toISOString(),
        mesaj: m.content || m.body || m.message || ''
      })) : []),
      dosyalar: raw.dosyalar || raw.attachments || raw.files || []
    };
  };

  const fetchTalep = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/ticket/${id}`);
      let data = null;
      if (res && res.data) {
        if (res.data.data) data = res.data.data;
        else data = res.data;
      }
      if (data && Object.keys(data).length > 0) {
        setTalep(normalizeTicket(data));
      } else {
        setTalep(ornek_talep);
      }
    } catch (err) {
      console.warn('API hata, mock veri kullanılıyor.', err?.message || err);
      message.info('API hatası oluştu — mock veri görüntüleniyor');
      setTalep(ornek_talep);
    } finally {
      setLoading(false);
    }
  };

  const durumRengi = (d) => {
    switch (d) {
      case 'Açık': return 'blue';
      case 'İşlemde': return 'orange';
      case 'Beklemede': return 'gold';
      case 'Çözüldü': return 'green';
      default: return 'default';
    }
  };
  const oncelikRengi = (o) => {
    switch (o) {
      case 'Acil': return 'red';
      case 'Yüksek': return 'volcano';
      case 'Normal': return 'blue';
      case 'Düşük': return 'green';
      default: return 'default';
    }
  };
  const getProgressPercentage = (d) => {
    switch (d) {
      case 'Açık': return 25;
      case 'İşlemde': return 50;
      case 'Beklemede': return 75;
      case 'Çözüldü': return 100;
      default: return 0;
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      message.warning('Lütfen bir mesaj yazın');
      return;
    }

    const newMsgObj = {
      sender: 'customer',
      name: talep?.owner?.name || 'Siz',
      tarih: new Date().toISOString(),
      mesaj: newMessage.trim()
    };

    setTalep(prev => ({ ...prev, mesajlar: [...(prev?.mesajlar || []), newMsgObj] }));
    setNewMessage('');
    setSending(true);
    try {
      await api.post(`/ticket/${id}/message`, { message: newMsgObj.mesaj });
      message.success('Mesaj gönderildi');
      fetchTalep();
    } catch (err) {
      console.error('Mesaj gönderme hatası', err);
      message.error('Mesaj sunucuya gönderilemedi — değişiklikler geri çekiliyor');
      fetchTalep();
    } finally {
      setSending(false);
    }
  };

  const renderAttachments = (dosyalar) => {
    if (!dosyalar || dosyalar.length === 0) return null;
    return (
      <div style={{ marginTop: 16 }}>
        <Title level={5}><PaperClipOutlined style={{ marginRight: 8 }} />Ek Dosyalar</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {dosyalar.map((d, i) => (
            <Card key={i} size="small" style={{ width: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileTextOutlined />
                <Text ellipsis style={{ flex: 1 }}>{d.name || d}</Text>
                <Tooltip title="İndir">
                  <a href={d.url || '#'} onClick={(e) => { if (!d.url) e.preventDefault(); }}>
                    <DownloadOutlined />
                  </a>
                </Tooltip>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
        <div style={{ marginTop: 12 }}>Talep yükleniyor...</div>
      </div>
    );
  }

  if (!talep) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Empty description="Talep bulunamadı" />
        <div style={{ marginTop: 12 }}>
          <Button className='save-btn' onClick={() => navigate('/talepler')}>Taleplere Dön</Button>
        </div>
      </div>
    );
  }
  const tabsItems = [
    {
      key: 'messages',
      label: (<span><MessageOutlined /> Mesajlar <Badge count={talep.mesajlar?.length || 0} style={{ marginLeft: 8 }} /></span>),
      children: (
        <div style={{ height: 480, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
            {talep.mesajlar && talep.mesajlar.length > 0 ? (
              <List
                dataSource={talep.mesajlar}
                renderItem={(m) => (
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                    <Avatar icon={<UserOutlined />} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <Text strong>{m.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(m.tarih).format('DD.MM.YYYY HH:mm')}</Text>
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <div style={{ background: '#fff9e6', padding: 12, borderRadius: 6, whiteSpace: 'pre-wrap' }}>
                          {m.mesaj}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            ) : (
              <Empty description="Henüz mesaj yok" />
            )}
            <div ref={messagesEndRef} />
          </div>

          <Divider />

          <div>
            <TextArea
              rows={4}
              placeholder="Bir cevap yazın..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <div>
                <Upload
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={handleFileChange}
                  showUploadList={{ showRemoveIcon: true }}
                >
                  <Button icon={<UploadOutlined />}>Dosya Ekle</Button>
                </Upload>
              </div>
              <div>
                <Space>
                  <Button onClick={() => { setNewMessage(''); setFileList([]); }}>Temizle</Button>
                  <Button className='save-btn' style={{color:'white'}} type="primary" icon={<SendOutlined />} onClick={handleSendMessage} loading={sending} disabled={!newMessage.trim()}>Gönder</Button>
                </Space>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'timeline',
      label: 'Zaman Çizelgesi',
      children: (
        <Timeline>
          <Timeline.Item color="green">Talep oluşturuldu — {talep.olusturmaTarihi ? dayjs(talep.olusturmaTarihi).format('DD.MM.YYYY HH:mm') : '-'}</Timeline.Item>
          {talep.mesajlar?.map((m, i) => (
            <Timeline.Item key={i} color={m.sender === 'support' ? 'blue' : 'gray'}>
              <div style={{ fontWeight: 600 }}>{m.name}</div>
              <div style={{ color: '#8c8c8c', fontSize: 13 }}>{m.mesaj}</div>
              <div style={{ color: '#8c8c8c', fontSize: 12 }}>{dayjs(m.tarih).format('DD.MM.YYYY HH:mm')}</div>
            </Timeline.Item>
          ))}
        </Timeline>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Geri</Button>
          <Title level={4} style={{ margin: 0 }}>{talep.baslik}</Title>
        </div>

      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size={48} icon={<UserOutlined />} />
                <div>
                  <Text strong>{talep.owner?.name || 'Müşteri'}</Text>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>{talep.olusturmaTarihi ? dayjs(talep.olusturmaTarihi).format('DD.MM.YYYY HH:mm') : '-'}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <Tag color={durumRengi(talep.durum)} style={{ fontWeight: 600 }}>{talep.durum}</Tag>
                <div style={{ marginTop: 6 }}>
                  <Tag color={oncelikRengi(talep.oncelik)}>{talep.oncelik}</Tag>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Card type="inner">
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{talep.aciklama}</Paragraph>
                {renderAttachments(talep.dosyalar)}
              </Card>
            </div>
          </Card>

          <Card>
            <Tabs defaultActiveKey="messages" items={tabsItems} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ marginBottom: 12 }}>
            <Title level={5}>Talep Bilgileri</Title>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Talep Eden">{talep.owner?.name}</Descriptions.Item>
              <Descriptions.Item label="Oluşturulma">{talep.olusturmaTarihi ? dayjs(talep.olusturmaTarihi).format('DD.MM.YYYY HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Son Aktivite">{talep.guncellemeTarihi ? dayjs(talep.guncellemeTarihi).format('DD.MM.YYYY HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Atanan">{talep.assignee?.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="ID"><Text code>#{talep._id}</Text></Descriptions.Item>
              <Descriptions.Item label="Durum"><Tag color={durumRengi(talep.durum)}>{talep.durum}</Tag></Descriptions.Item>
              <Descriptions.Item label="Öncelik"><Tag color={oncelikRengi(talep.oncelik)}>{talep.oncelik}</Tag></Descriptions.Item>
              <Descriptions.Item label="Sorun"><Tag>{talep.kategori}</Tag></Descriptions.Item>
            </Descriptions>
          </Card>

          <Card>
            <Title level={5}>İlerleme</Title>
            <Progress percent={getProgressPercentage(talep.durum)} status={talep.durum === 'Çözüldü' ? 'success' : 'active'} />

            <div style={{ marginTop: 12 }}>
              {talep.durum === 'Çözüldü' && (
                <Alert type="success" message="Talep çözüldü" description="Bu talep çözüldü. İstersen yeni bir talep açabilirsiniz." showIcon />
              )}
              {talep.durum === 'Beklemede' && (
                <Alert type="warning" message="Talep beklemede" description="Destek ekibi ek bilgi bekliyor." showIcon />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
