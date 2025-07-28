import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Typography, 
  Tooltip, 
  Pagination,
  Row,
  Col,
  Statistic,
  Empty,
  Spin,
  Table
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  ReloadOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const TalepListesi = () => {
  const [talepler, setTalepler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreler, setFiltreler] = useState({ 
    durum: '', 
    kategori: '', 
    oncelik: '', 
    arama: '' 
  });
  const [pagination, setPagination] = useState({ 
    current: 1, 
    pageSize: 6 
  });
  
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    axios.get('/api/ticket')
      .then(res => {
        if (res.data && res.data.success) {
          setTalepler(res.data.data);
        } else {
          setTalepler([]);
        }
      })
      .catch(() => {
        setTalepler([]);
      })
      .finally(() => setLoading(false));
  }, []);


  const filtreliTalepler = talepler.filter(talep => {
    const durum = filtreler.durum ? talep.durum === filtreler.durum : true;
    const kategori = filtreler.kategori ? talep.kategori === filtreler.kategori : true;
    const oncelik = filtreler.oncelik ? talep.oncelik === filtreler.oncelik : true;
    const arama = filtreler.arama ? talep.baslik.toLowerCase().includes(filtreler.arama.toLowerCase()) : true;
    
    return durum && kategori && oncelik && arama;
  });

  const pagedTalepler = filtreliTalepler.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

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


  const istatistikler = {
    toplam: talepler.length,
    acik: talepler.filter(t => t.durum === 'Açık').length,
    cozuldu: talepler.filter(t => t.durum === 'Çözüldü').length,
    islemde: talepler.filter(t => t.durum === 'İşlemde').length
  };

  const handleFiltreDegisikligi = (key, value) => {
    setFiltreler(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };
  const handleArama = (value) => {
    setFiltreler(prev => ({ ...prev, arama: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }
  const columns = [
    {
      title: '',
      dataIndex: 'durum',
      key: 'durum',
      width: 48,
      align: 'center',
      render: (text) => {
        let color = '#1890ff';
        let icon = <ExclamationCircleOutlined />;
        if (text === 'Açık') { color = '#1890ff'; icon = <ExclamationCircleOutlined />;}
        else if (text === 'İşlemde') { color = '#fa8c16'; icon = <ClockCircleOutlined />;}
        else if (text === 'Beklemede') { color = '#faad14'; icon = <ClockCircleOutlined />;}
        else if (text === 'Çözüldü') { color = '#52c41a'; icon = <CheckCircleOutlined />;}
        else if (text === 'Kapalı') { color = '#bfbfbf'; icon = <FileTextOutlined />;}
        return <span style={{ color, fontSize: 20 }}>{icon}</span>;
      }
    },
    {
      title: 'Talep No',
      dataIndex: 'talepNumarasi',
      key: 'talepNumarasi',
      width: 90,
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    {
      title: 'Konu',
      dataIndex: 'baslik',
      key: 'baslik',
      render: (text, record) => (
        <span style={{ color: '#1890ff', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate(`/talep/${record._id}`)}>{text}</span>
      )
    },
    {
      title: 'Öncelik',
      dataIndex: 'oncelik',
      key: 'oncelik',
      width: 90,
      render: (text) => {
        let color = '#1890ff';
        if (text === 'Acil') color = '#f5222d';
        else if (text === 'Yüksek') color = '#fa8c16';
        else if (text === 'Normal') color = '#1890ff';
        else if (text === 'Düşük') color = '#52c41a';
        return <span style={{ color, fontWeight: 600 }}>{text}</span>;
      }
    },
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
      width: 120,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Son Güncelleme',
      dataIndex: 'sonGuncelleme',
      key: 'sonGuncelleme',
      width: 120,
      render: (text) => dayjs(text).format('DD.MM.YYYY')
    },
    {
      title: 'Oluşturulma Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (text) => dayjs(text).format('DD.MM.YYYY')
    },
    {
      title: '',
      key: 'islemler',
      width: 60,
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined style={{ fontSize: 18 }} />}
          style={{ color: '#6C3FC5', fontWeight: 600 }}
          onClick={() => navigate(`/talep/${record._id}`)}
        />
      )
    }
  ];
  const dataSource = filtreliTalepler.map(t => ({ ...t, key: t._id }));

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span className="page-title" style={{ fontSize: 22, fontWeight: 600, color: '#222', marginBottom: 6 }}>Taleplerim</span>
          <Button
            type="primary"
            icon={<PlusOutlined style={{ fontSize: 18, marginRight: 4 }} />}
            size="large"
            style={{ borderRadius: 8, fontWeight: 600, fontSize: 16, height: 44, minWidth: 120, background: '#6C3FC5', borderColor: '#6C3FC5' }}
            onClick={() => navigate('/talep-olustur')}
          >
            Yeni Talep
          </Button>
        </div>
        <div className="filter-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 0 }}>
          <Search
            placeholder="Talep ara..."
            allowClear
            style={{ width: 300, borderRadius: 8 }}
            onSearch={handleArama}
            onPressEnter={(e) => handleArama(e.target.value)}
          />
          <Select
            placeholder="Durum"
            allowClear
            style={{ width: 130, borderRadius: 8 }}
            onChange={(value) => handleFiltreDegisikligi('durum', value)}
          >
            <Option value="Açık">Açık</Option>
            <Option value="İşlemde">İşlemde</Option>
            <Option value="Beklemede">Beklemede</Option>
            <Option value="Çözüldü">Çözüldü</Option>
            <Option value="Kapalı">Kapalı</Option>
          </Select>
          <Select
            placeholder="Kategori"
            allowClear
            style={{ width: 130, borderRadius: 8 }}
            onChange={(value) => handleFiltreDegisikligi('kategori', value)}
          >
            <Option value="Teknik Destek">Teknik</Option>
            <Option value="Fatura">Fatura</Option>
            <Option value="Genel">Genel</Option>
            <Option value="Özellik Talebi">Özellik</Option>
            <Option value="Hata Bildirimi">Hata</Option>
          </Select>
          <Select
            placeholder="Öncelik"
            allowClear
            style={{ width: 130, borderRadius: 8 }}
            onChange={(value) => handleFiltreDegisikligi('oncelik', value)}
          >
            <Option value="Düşük">Düşük</Option>
            <Option value="Normal">Normal</Option>
            <Option value="Yüksek">Yüksek</Option>
            <Option value="Acil">Acil</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            style={{ borderRadius: 8, fontWeight: 500, fontSize: 15, height: 44 }}
            onClick={() => {
              setFiltreler({ durum: '', kategori: '', oncelik: '', arama: '' });
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
          >
            Temizle
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: filtreliTalepler.length,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} talep`,
          onChange: (page) => setPagination(prev => ({ ...prev, current: page }))
        }}
        bordered
        style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(24,144,255,0.08)', marginTop: 0 }}
        size="middle"
      />
      <div style={{ height: 24 }} />
    </div>
  );
};
export default TalepListesi;