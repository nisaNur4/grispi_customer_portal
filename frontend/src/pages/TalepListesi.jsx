import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Input,
  Select,
  Avatar,
  Button,
  Row,
  Col,
  Tabs,
  DatePicker,
  Empty,
  Spin,
  Typography,
  Tooltip
} from 'antd';
import {
  MoreOutlined,
  EyeOutlined,
  ReloadOutlined,

} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../utils/axios'; 
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ornek_talep = [
  {
    _id: '254',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Açık', 
    kategori: 'category1',
    oncelik: 'Yüksek',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 4,
    tumu: true,
    cc: false,
    follower: false,
  },
  {
    _id: '251',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Kapalı', 
    kategori: 'category2',
    oncelik: 'Yüksek',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 2,
    tumu: true,
    cc: true,
    follower: false,
  },
  {
    _id: '2711',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Açık', 
    kategori: 'category3',
    oncelik: 'Düşük',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 0,
    tumu: true,
    cc: false,
    follower: true,
  },
  {
    _id: '101',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Açık', 
    kategori: 'category4',
    oncelik: 'Normal',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 4,
    tumu: true,
    cc: false,
    follower: false,
  },
  {
    _id: '589',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Kapalı', 
    kategori: 'category5',
    oncelik: 'Normal',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 2,
    tumu: true,
    cc: true,
    follower: false,
  },
  {
    _id: '543',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Açık', 
    kategori: 'category6',
    oncelik: 'Düşük',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 0,
    tumu: true,
    cc: false,
    follower: true,
  },
  {
    _id: '2541',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Açık', 
    kategori: 'category1',
    oncelik: 'Yüksek',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 4,
    tumu: false,
    cc: true,
    follower: false,
  },
  {
    _id: '2511',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Kapalı', 
    kategori: 'category2',
    oncelik: 'Yüksek',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 2,
    tumu: false,
    cc: true,
    follower: false,
  },
  {
    _id: '271',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Açık', 
    kategori: 'category3',
    oncelik: 'Düşük',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 0,
    tumu: false,
    cc: false,
    follower: true,
  },
  {
    _id: '1011',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Açık', 
    kategori: 'category4',
    oncelik: 'Normal',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 4,
    tumu: false,
    cc: false,
    follower: true,
  },
  {
    _id: '5891',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Kapalı', 
    kategori: 'category5',
    oncelik: 'Normal',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 2,
    tumu: false,
    cc: true,
    follower: false,
  },
  {
    _id: '5431',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Açık', 
    kategori: 'category6',
    oncelik: 'Düşük',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 0,
    tumu: false,
    cc: false,
    follower: true,
  }
];



const durumRenk = (durum) => {
  switch (durum) {
    case 'Açık':
      return '#f5222d'; 
    case 'İşlemde':
      return '#fa8c16';
    case 'Beklemede':
      return '#faad14'; 
    case 'Çözüldü':
      return '#52c41a';
    case 'Kapalı':
      return '#52c41a';
    default:
      return '#8c8c8c';
  }
};

const oncelikRenk = (o) => {
  switch (o) {
    case 'Acil':
      return 'red';
    case 'Yüksek':
      return 'orange';
    case 'Normal':
      return 'blue';
    case 'Düşük':
      return 'green';
    default:
      return 'default';
  }
};

const durumKisaltma = (durum) => {
  if (!durum) return '';
  switch (durum) {
    case 'Açık':
      return 'O';
    case 'Çözüldü':
      return 'ç';
    case 'İşlemde':
      return 'İ';
    case 'Beklemede':
      return 'B';
    case 'Kapalı':
      return 'C';
    default:
      return durum[0];
  }
};

export default function TalepListesi() {
  const navigate = useNavigate();

  const [talepler, setTalepler] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('my'); 
  const [searchText, setSearchText] = useState('');
  const [durumFilter, setDurumFilter] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [oncelikFilter, setOncelikFilter] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [orderBy, setOrderBy] = useState('guncelleme'); 

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    let data = [];
    try {
      if (api && typeof api.get === 'function') {
        const res = await api.get('/ticket');
        if (res && res.data) {
          if (Array.isArray(res.data)) data = res.data;
          else if (Array.isArray(res.data.data)) data = res.data.data;
        }
      }
    } catch (err) {

    }

    if (!data || data.length === 0) data = ornek_talep;

    const normalized = data.map(item => ({
      ...item,
      olusturmaTarihi: item.olusturmaTarihi || item.createdAt || item.created_at || item.created || null,
      guncellemeTarihi: item.guncellemeTarihi || item.updatedAt || item.updated_at || item.updated || item.guncellemeTarihi || null
    }));

    setTalepler(normalized);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return talepler
    .filter(t => {
      switch (activeTab) {
        case 'my':
          return t.tumu === true;
        case 'cc':
          return t.cc === true;
        case 'follower':
          return t.follower === true;
        default:
          return true;
      }
    })
      .filter(t => {
        if (durumFilter) return t.durum === durumFilter;
        return true;
      })
      .filter(t => {
        if (kategoriFilter) return t.kategori === kategoriFilter;
        return true;
      })
      .filter(t => {
        if (oncelikFilter) return t.oncelik === oncelikFilter;
        return true;
      })
      .filter(t => {
        if (dateRange && dateRange.length === 2) {
          const start = dayjs(dateRange[0]).startOf('day');
          const end = dayjs(dateRange[1]).endOf('day');
          const updated = dayjs(t.guncellemeTarihi || t.olusturmaTarihi);
          return updated.isAfter(start) && updated.isBefore(end) || updated.isSame(start) || updated.isSame(end);
        }
        return true;
      })
      .filter(t => {
        if (!searchText) return true;
        const q = searchText.toLowerCase();
        return (
          (t.baslik && t.baslik.toLowerCase().includes(q)) ||
          (t.aciklama && t.aciklama.toLowerCase().includes(q)) ||
          (t._id && t._id.toString().toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (orderBy === 'guncelleme') return dayjs(b.guncellemeTarihi).unix() - dayjs(a.guncellemeTarihi).unix();
        if (orderBy === 'olusturma') return dayjs(b.olusturmaTarihi).unix() - dayjs(a.olusturmaTarihi).unix();
        if (orderBy === 'oncelik') {
          const order = { 'Acil': 4, 'Yüksek': 3, 'Normal': 2, 'Düşük': 1 };
          return (order[b.oncelik] || 0) - (order[a.oncelik] || 0);
        }
        return 0;
      });
  }, [talepler, activeTab, searchText, durumFilter, kategoriFilter, oncelikFilter, dateRange, orderBy]);

  const columns = [
    {
      title: 'Status',
      dataIndex: 'durum',
      key: 'status',
      width: 80,
      render: (durum) => (
        <Avatar style={{ backgroundColor: durumRenk(durum), verticalAlign: 'middle', fontWeight: 700 }}>
          {durumKisaltma(durum)}
        </Avatar>
      )
    },
    {
      title: 'Ticket ID',
      dataIndex: '_id',
      key: 'id',
      width: 110,
      render: (id) => <Text code>{`#${id}`}</Text>
    },
    {
      title: 'Subject',
      dataIndex: 'baslik',
      key: 'baslik',
      render: (text, record) => (
        <div>
          <Text strong style={{ cursor: 'pointer', color: '#722ED1' }} onClick={() => navigate(`/talep/${record._id}`)}>
            {text}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.aciklama && record.aciklama.length > 60 ? `${record.aciklama.substring(0, 60)}...` : record.aciklama}
          </Text>
        </div>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'oncelik',
      key: 'oncelik',
      width: 100,
      render: (o) => <Tag color={oncelikRenk(o)} style={{ textTransform: 'capitalize' }}>{o}</Tag>
    },
    {
      title: 'Category',
      dataIndex: 'kategori',
      key: 'kategori',
      width: 120,
      render: (k) => <Tag>{k}</Tag>
    },
    {
      title: 'Update Date',
      dataIndex: 'guncellemeTarihi',
      key: 'guncellemeTarihi',
      width: 120,
      render: (d) => (
        <div>
          <Text>{d ? dayjs(d).format('DD.MM.YYYY') : '-'}</Text>
        </div>
      )
    },
    {
      title: 'Created Date',
      dataIndex: 'olusturmaTarihi',
      key: 'olusturmaTarihi',
      width: 120,
      render: (d) => <Text>{d ? dayjs(d).format('DD.MM.YYYY') : '-'}</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Space>
          <Tooltip title="Görüntüle">
            <Button shape="circle" icon={<EyeOutlined />} size="small" onClick={() => navigate(`/talep/${record._id}`)} />
          </Tooltip>
          <Tooltip title="Diğer">
            <Button shape="circle" icon={<MoreOutlined />} size="small" />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="ticket-page" style={{ padding: 20 }}>

      <div className="top-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Title level={3} style={{ margin: 0 }}>Destek Taleplerim</Title>
        </div>

        <div className="right-controls">
          <Search placeholder="Talep ara" allowClear onSearch={setSearchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 220 }} value={searchText} />
          <Select value={orderBy} onChange={setOrderBy} style={{ width: 160 }}>
            <Option value="guncelleme">Sırala: Güncelleme Tarihi</Option>
            <Option value="olusturma">Sırala: Oluşturulma Tarihi</Option>
            <Option value="oncelik">Sırala: Önceliğe Göre</Option>
          </Select>
          <Button className='save-btn' icon={<ReloadOutlined />} onClick={fetchTickets}>Yenile</Button>
        </div>
      </div>

      <Card style={{ marginBottom: 12 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span>My Requests</span>} key="my" />
          <TabPane tab={<span>Requests I'm CC'd On</span>} key="cc" />
          <TabPane tab={<span>Requests I'm Followers On</span>} key="follower" />
        </Tabs>

        <div className="filters" style={{ marginTop: 8 }}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Select allowClear placeholder="Durum" value={durumFilter} onChange={setDurumFilter} style={{ width: '100%' }}>
                <Option value="Açık">Açık</Option>
                <Option value="İşlemde">İşlemde</Option>
                <Option value="Beklemede">Beklemede</Option>
                <Option value="Çözüldü">Çözüldü</Option>
                <Option value="Kapalı">Kapalı</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Select allowClear placeholder="Kategori" value={kategoriFilter} onChange={setKategoriFilter} style={{ width: '100%' }}>
                <Option value="category1">category1</Option>
                <Option value="category2">category2</Option>
                <Option value="category3">category3</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Select allowClear placeholder="Öncelik" value={oncelikFilter} onChange={setOncelikFilter} style={{ width: '100%' }}>
                <Option value="Düşük">Düşük</Option>
                <Option value="Normal">Normal</Option>
                <Option value="Yüksek">Yüksek</Option>
                <Option value="Acil">Acil</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <RangePicker style={{ width: '100%' }} onChange={(d) => setDateRange(d)} />
            </Col>
          </Row>
        </div>

      </Card>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <Empty description={searchText || durumFilter || kategoriFilter ? 'Filtrelere uygun talep bulunamadı' : 'Henüz talep yok'} />
        ) : (
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey={(r) => r._id}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>
    </div>
  );
}
