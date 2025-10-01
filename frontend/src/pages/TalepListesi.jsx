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
  Tooltip,
  Statistic,
  Badge
} from 'antd';
import {
  MoreOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../utils/axios'; 
import { useNavigate } from 'react-router-dom';
import { durumRengi, oncelikRengi } from '../utils/helpers';
import '../App.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
    baslik: 'Example Ticket Headline 2',
    aciklama: 'Example Ticket Headline 2',
    durum: 'Çözüldü',
    kategori: 'category2',
    oncelik: 'Düşük',
    guncellemeTarihi: '2025-02-14T14:30:00Z',
    olusturmaTarihi: '2025-01-23T09:12:00Z',
    mesajlar: 2,
    tumu: false,
    cc: true,
    follower: true,
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
    mesajlar: 4,
    tumu: true,
    cc: false,
    follower: false,
  },
  {
    _id: '101',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Çözüldü',
    kategori: 'category2',
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
    durum: 'Çözüldü',
    kategori: 'category3',
    oncelik: 'Normal',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 4,
    tumu: true,
    cc: false,
    follower: false,
  },
  {
    _id: '543',
    baslik: 'Example Ticket Headline',
    aciklama: 'Example Ticket Headline',
    durum: 'Çözüldü',
    kategori: 'category1',
    oncelik: 'Yüksek',
    guncellemeTarihi: '2025-02-15T14:30:00Z',
    olusturmaTarihi: '2025-01-24T09:12:00Z',
    mesajlar: 4,
    tumu: true,
    cc: false,
    follower: false,
  },
];


const TalepListesi = () => {
  const navigate = useNavigate();
  const [talepler, setTalepler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [durumFilter, setDurumFilter] = useState(null);
  const [kategoriFilter, setKategoriFilter] = useState(null);
  const [oncelikFilter, setOncelikFilter] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [tabKey, setTabKey] = useState('all');

  const stats = useMemo(() => {
    const acik = talepler.filter(t => t.durum === 'Açık').length;
    const cozulen = talepler.filter(t => t.durum === 'Çözüldü').length;
    const yuksek = talepler.filter(t => t.oncelik === 'Yüksek' || t.oncelik === 'Acil').length;
    const toplam = talepler.length;
    return { acik, cozulen, yuksek, toplam };
  }, [talepler]);

  const fetchTalepler = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ticket');
      setTalepler(res.data.data || ornek_talep);
    } catch (err) {
      console.warn('API hata, mock veri kullanılıyor.', err.message);
      setTalepler(ornek_talep);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalepler();
  }, []);

  const filtered = useMemo(() => {
    let temp = talepler;

    if (tabKey === 'assigned') {
        temp = temp.filter(t => t.cc);
    } else if (tabKey === 'followed') {
        temp = temp.filter(t => t.follower);
    }

    if (searchText) {
      temp = temp.filter(
        (t) =>
          t.baslik.toLowerCase().includes(searchText.toLowerCase()) ||
          t._id.includes(searchText)
      );
    }
    
    if (durumFilter) {
      temp = temp.filter((t) => t.durum === durumFilter);
    }
    if (kategoriFilter) {
      temp = temp.filter((t) => t.kategori === kategoriFilter);
    }
    if (oncelikFilter) {
      temp = temp.filter((t) => t.oncelik === oncelikFilter);
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      temp = temp.filter((t) =>
        dayjs(t.olusturmaTarihi).isAfter(start.startOf('day')) &&
        dayjs(t.olusturmaTarihi).isBefore(end.endOf('day'))
      );
    }
    return temp;
  }, [
    talepler,
    searchText,
    durumFilter,
    kategoriFilter,
    oncelikFilter,
    dateRange,
    tabKey,
  ]);

  const columns = [
    {
      title: <span style={{ color: 'black' }}>#</span>,
      dataIndex: '_id',
      key: '_id',
      sorter: (a, b) => a._id.localeCompare(b._id),
      render: (text) => <Text code style={{ color: 'black' }}>#{text}</Text>,
    },
    {
      title: <span style={{ color: 'black' }}>Başlık</span>,
      dataIndex: 'baslik',
      key: 'baslik',
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong style={{ color: 'black' }}>{text}</Text>
        </Space>
      ),
      ellipsis: true,
    },
    {
      title: <span style={{ color: 'black' }}>Durum</span>,
      dataIndex: 'durum',
      key: 'durum',
      render: (durum) => (
        <Tag color={durumRengi(durum)}>{durum}</Tag>
      ),
      filters: [
        { text: 'Açık', value: 'Açık' },
        { text: 'İşlemde', value: 'İşlemde' },
        { text: 'Beklemede', value: 'Beklemede' },
        { text: 'Çözüldü', value: 'Çözüldü' },
      ],
      onFilter: (value, record) => record.durum === value,
    },
    {
      title: <span style={{ color: 'black' }}>Öncelik</span>,
      dataIndex: 'oncelik',
      key: 'oncelik',
      render: (oncelik) => (
        <Tag color={oncelikRengi(oncelik)}>{oncelik}</Tag>
      ),
      filters: [
        { text: 'Düşük', value: 'Düşük' },
        { text: 'Normal', value: 'Normal' },
        { text: 'Yüksek', value: 'Yüksek' },
        { text: 'Acil', value: 'Acil' },
      ],
      onFilter: (value, record) => record.oncelik === value,
    },
    {
      title: <span style={{ color: 'black' }}>Güncelleme Tarihi</span>,
      dataIndex: 'guncellemeTarihi',
      key: 'guncellemeTarihi',
      sorter: (a, b) =>
        dayjs(a.guncellemeTarihi).unix() - dayjs(b.guncellemeTarihi).unix(),
      render: (tarih) => <Text style={{ color: 'black' }}>{dayjs(tarih).format('DD.MM.YYYY HH:mm')}</Text>,
    },
    {
      title: <span style={{ color: 'black' }}>Created Date</span>,
      dataIndex: 'olusturmaTarihi',
      key: 'olusturmaTarihi',
      width: 120,
      render: (d) => <Text style={{ color: 'black' }}>{d ? dayjs(d).format('DD.MM.YYYY') : '-'}</Text>
    },
    {
      title: <span style={{ color: 'black' }}>İşlemler</span>,
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Detaylar">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/talep/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Daha fazla">
            <Button icon={<MoreOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container talep-listesi">
      <Title level={2} className="page-title" style={{ color: 'black' }}>Talepler</Title>
      
      <Row gutter={[16, 16]} className="kpi-grid">
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title={<span className="stat-title">Açık Talepler</span>} value={stats.acik} valueStyle={{ color: '#6a1b9a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title={<span className="stat-title">Çözülen</span>} value={stats.cozulen} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title={<span className="stat-title">Yüksek/Acil</span>} value={stats.yuksek} valueStyle={{ color: '#fa541c' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title={<span className="stat-title">Toplam</span>} value={stats.toplam} />
          </Card>
        </Col>
      </Row>
      
      <div className="tab-buttons">
        <Tabs
          activeKey={tabKey}
          onChange={setTabKey}
          items={[
            { key: 'all', label: <span style={{ color: 'black' }}>Tüm Talepler</span> },
            { key: 'assigned', label: <span style={{ color: 'black' }}>CC Olduklarım</span> },
            { key: 'followed', label: <span style={{ color: 'black' }}>Takip Ettiklerim</span> },
          ]}
        />
        <Badge dot>
          <Button icon={<ReloadOutlined />} onClick={fetchTalepler} type="default">Yenile</Button>
        </Badge>
      </div>

      <Card className="filter-card">
        <div className="filter-header">
          <Search
            placeholder="Talep başlığı veya ID ile ara..."
            onSearch={setSearchText}
            allowClear
            className="search-input"
          />
        </div>

        <div className="filter-area">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Select allowClear placeholder="Durum" value={durumFilter} onChange={setDurumFilter} className="full-width-select">
                <Option value="Açık">Açık</Option>
                <Option value="İşlemde">İşlemde</Option>
                <Option value="Beklemede">Beklemede</Option>
                <Option value="Çözüldü">Çözüldü</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Select allowClear placeholder="Kategori" value={kategoriFilter} onChange={setKategoriFilter} className="full-width-select">
                <Option value="category1">category1</Option>
                <Option value="category2">category2</Option>
                <Option value="category3">category3</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Select allowClear placeholder="Öncelik" value={oncelikFilter} onChange={setOncelikFilter} className="full-width-select">
                <Option value="Düşük">Düşük</Option>
                <Option value="Normal">Normal</Option>
                <Option value="Yüksek">Yüksek</Option>
                <Option value="Acil">Acil</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <RangePicker className="full-width-select" onChange={(d) => setDateRange(d)} />
            </Col>
          </Row>
        </div>
      </Card>

      <Card className="table-card">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <Empty description={searchText || durumFilter || kategoriFilter || oncelikFilter || dateRange ? 'Filtrelere uygun talep bulunamadı' : 'Henüz talep yok'} />
        ) : (
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey={(r) => r._id}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  navigate(`/talep/${record._id}`);
                },
              };
            }}
            rowClassName="clickable-row"
          />
        )}
      </Card>
    </div>
  );
};

export default TalepListesi;