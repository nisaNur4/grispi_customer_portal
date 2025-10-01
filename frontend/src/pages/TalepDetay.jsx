import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row, Col, Card, Tabs, List, Avatar, Input, Button, Upload, Descriptions, Tag,
  Badge, Timeline, Progress, Empty, Spin, message, Tooltip, Space, Divider, Alert, Typography
} from 'antd';
import {
  ArrowLeftOutlined, SendOutlined, FileTextOutlined, PaperClipOutlined, DownloadOutlined,
  UserOutlined, UploadOutlined, MessageOutlined, UndoOutlined, RedoOutlined, BoldOutlined,
  ItalicOutlined, UnderlineOutlined, StrikethroughOutlined, LinkOutlined, OrderedListOutlined,
  UnorderedListOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../utils/axios';
import { durumRengi, oncelikRengi } from '../utils/helpers';

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

const TalepDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [talep, setTalep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [fileList, setFileList] = useState([]);
  const messagesEndRef = useRef(null);
  const editorRef = useRef(null);

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

  const fetchTalep = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchTalep();
  }, [fetchTalep]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [talep?.mesajlar]);

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
  
  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleLink = () => {
    const url = prompt('Lütfen URL adresini girin:');
    if (url) {
      handleFormat('createLink', url);
    }
  };

  const handleSendMessage = async () => {
    if (!editorRef.current || !editorRef.current.innerHTML.trim()) {
      message.warning('Lütfen bir mesaj yazın');
      return;
    }

    const newMsgObj = {
      sender: 'customer',
      name: talep?.owner?.name || 'Siz',
      tarih: new Date().toISOString(),
      mesaj: editorRef.current.innerHTML.trim()
    };
    
    setTalep(prev => ({ ...prev, mesajlar: [...(prev?.mesajlar || []), newMsgObj] }));

    editorRef.current.innerHTML = '';
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
      <div className="attachments-container">
        <Title level={5}><PaperClipOutlined className="attachments-icon" />Ek Dosyalar</Title>
        <div className="attachments-list">
          {dosyalar.map((d, i) => (
            <Card key={i} size="small" className="attachment-card">
              <div className="attachment-item">
                <FileTextOutlined />
                <Text ellipsis className="attachment-name">{d.name || d}</Text>
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
      <div className="loading-container">
        <Spin size="large" />
        <div className="loading-text">Talep yükleniyor...</div>
      </div>
    );
  }

  if (!talep) {
    return (
      <div className="empty-container">
        <Empty description="Talep bulunamadı" />
        <div className="empty-action">
          <Button className='save-btn' onClick={() => navigate('/talepler')}>Taleplere Dön</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container talep-detay">
      <div className="talep-header">
        <div className="talep-header-left">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Geri</Button>
          <Title level={4} className="talep-title">{talep.baslik}</Title>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="talep-main-card">
            <div className="talep-main-header">
              <div className="talep-main-header-left">
                <Avatar size={48} icon={<UserOutlined />} />
                <div className="talep-owner-info">
                  <Text strong>{talep.owner?.name || 'Müşteri'}</Text>
                  <div className="talep-date">{talep.olusturmaTarihi ? dayjs(talep.olusturmaTarihi).format('DD.MM.YYYY HH:mm') : '-'}</div>
                </div>
              </div>

              <div className="talep-status-info">
                <Tag color={durumRengi(talep.durum)} className="talep-status-tag">{talep.durum}</Tag>
                <div className="talep-priority-tag-container">
                  <Tag color={oncelikRengi(talep.oncelik)}>{talep.oncelik}</Tag>
                </div>
              </div>
            </div>

            <div className="talep-content">
              <Card type="inner" className="talep-description-card">
                <Paragraph className="talep-description-text">{talep.aciklama}</Paragraph>
                {renderAttachments(talep.dosyalar)}
              </Card>
            </div>
          </Card>

          <Card className="talep-messages-card">
            <Tabs
              defaultActiveKey="messages"
              items={[
                {
                  key: 'messages',
                  label: (
                    <span>
                      <MessageOutlined /> Mesajlar
                      <Badge
                        count={talep.mesajlar?.length || 0}
                        className="message-badge"
                      />
                    </span>
                  ),
                  children: (
                    <div className="messages-tab-content">
                      <div className="messages-list-wrapper">
                        {talep.mesajlar && talep.mesajlar.length > 0 ? (
                          <List
                            dataSource={talep.mesajlar}
                            renderItem={(m) => (
                              <div className="message-item">
                                <Avatar icon={<UserOutlined />} />
                                <div className="message-content-wrapper">
                                  <div className="message-header">
                                    <Text strong>{m.name}</Text>
                                    <Text type="secondary" className="message-date">
                                      {dayjs(m.tarih).format('DD.MM.YYYY HH:mm')}
                                    </Text>
                                  </div>
                                  <div className="message-body">
                                    <div className="message-text">{m.mesaj}</div>
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
                        <div className="editor-toolbar">
                          <Tooltip title="Geri Al"><Button type="text" onClick={() => handleFormat('undo')} icon={<UndoOutlined />} /></Tooltip>
                          <Tooltip title="İleri Al"><Button type="text" onClick={() => handleFormat('redo')} icon={<RedoOutlined />} /></Tooltip>
                          <Tooltip title="Kalın"><Button type="text" onClick={() => handleFormat('bold')} icon={<BoldOutlined />} /></Tooltip>
                          <Tooltip title="İtalik"><Button type="text" onClick={() => handleFormat('italic')} icon={<ItalicOutlined />} /></Tooltip>
                          <Tooltip title="Altı Çizili"><Button type="text" onClick={() => handleFormat('underline')} icon={<UnderlineOutlined />} /></Tooltip>
                          <Tooltip title="Üstü Çizili"><Button type="text" onClick={() => handleFormat('strikeThrough')} icon={<StrikethroughOutlined />} /></Tooltip>
                          <Tooltip title="Link Ekle"><Button type="text" onClick={handleLink} icon={<LinkOutlined />} /></Tooltip>
                          <Tooltip title="Sıralı Liste"><Button type="text" onClick={() => handleFormat('insertOrderedList')} icon={<OrderedListOutlined />} /></Tooltip>
                          <Tooltip title="Sırasız Liste"><Button type="text" onClick={() => handleFormat('insertUnorderedList')} icon={<UnorderedListOutlined />} /></Tooltip>
                          <Tooltip title="Sola Hizala"><Button type="text" onClick={() => handleFormat('justifyLeft')} icon={<AlignLeftOutlined />} /></Tooltip>
                          <Tooltip title="Ortala"><Button type="text" onClick={() => handleFormat('justifyCenter')} icon={<AlignCenterOutlined />} /></Tooltip>
                          <Tooltip title="Sağa Hizala"><Button type="text" onClick={() => handleFormat('justifyRight')} icon={<AlignRightOutlined />} /></Tooltip>
                          <Tooltip title="Metin Rengi"><Button type="text" icon={<BgColorsOutlined />} /></Tooltip>
                          <Tooltip title="Dosya Ekle"><Button type="text" icon={<PaperClipOutlined />} /></Tooltip>
                        </div>
                        <Tooltip title="Mesajınızı buraya yazın." >
                           <div
                              ref={editorRef}
                              contentEditable={true}
                              style={{
                                  border: '1px solid #d9d9d9',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  minHeight: '150px',
                                  backgroundColor: '#fff',
                                  outline: 'none',
                              }}
                          />
                        </Tooltip>

                        <div className="message-actions">
                          <div>
                            <Upload
                              beforeUpload={() => false}
                              fileList={fileList}
                              onChange={handleFileChange}
                              showUploadList={{ showRemoveIcon: true }}
                            >
                              <Tooltip title="Görsel veya dosyaya ilişkin belge ekleyin">
                                <Button icon={<UploadOutlined />}>Dosya Ekle</Button>
                              </Tooltip>
                            </Upload>
                          </div>
                          <div>
                            <Space>
                              <Button
                                onClick={() => {
                                  if (editorRef.current) {
                                    editorRef.current.innerHTML = '';
                                  }
                                  setFileList([]);
                                }}
                              >
                                Temizle
                              </Button>
                              <Button
                                className="save-btn"
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={handleSendMessage}
                                loading={sending}
                                disabled={!editorRef.current?.innerHTML.trim()}
                              >
                                Gönder
                              </Button>
                            </Space>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'timeline',
                  label: 'Zaman Çizelgesi',
                  children: (
                    <Timeline>
                      <Timeline.Item color="green">
                        Talep oluşturuldu —{' '}
                        {talep.olusturmaTarihi
                          ? dayjs(talep.olusturmaTarihi).format('DD.MM.YYYY HH:mm')
                          : '-'}
                      </Timeline.Item>
                      {talep.mesajlar?.map((m, i) => (
                        <Timeline.Item
                          key={i}
                          color={m.sender === 'support' ? 'blue' : 'gray'}
                        >
                          <div className="timeline-item-title">{m.name}</div>
                          <div className="timeline-item-content">{m.mesaj}</div>
                          <div className="timeline-item-date">
                            {dayjs(m.tarih).format('DD.MM.YYYY HH:mm')}
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ),
                },
              ]}
            />

          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="talep-sidebar-card">
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
        </Col>
      </Row>
    </div>
  );
}

export default TalepDetay;