
import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Typography, 
  Space, 
  message,
  Upload,
  Row,
  Col,
  Steps,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  SaveOutlined,
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const TalepOlustur = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);

  const kategoriSecenekleri = [
    { value: 'Teknik Destek', label: 'Teknik Destek', icon: '' },
    { value: 'Fatura', label: 'Fatura', icon: '' },
    { value: 'Genel', label: 'Genel', icon: '' },
    { value: 'Özellik Talebi', label: 'Özellik Talebi', icon: '' },
    { value: 'Hata Bildirimi', label: 'Hata Bildirimi', icon: '' }
  ];

  const oncelikSecenekleri = [
    { value: 'Düşük', label: 'Düşük', color: '#52c41a' },
    { value: 'Normal', label: 'Normal', color: '#1890ff' },
    { value: 'Yüksek', label: 'Yüksek', color: '#fa8c16' },
    { value: 'Acil', label: 'Acil', color: '#f5222d' }
  ];

  const steps = [
    {
      title: 'Temel Bilgiler',
      description: 'Talep başlığı ve kategorisi',
      icon: <FileTextOutlined />
    },
    {
      title: 'Detaylar',
      description: 'Açıklama ve öncelik',
      icon: <ExclamationCircleOutlined />
    },
    {
      title: 'Dosyalar',
      description: 'Ek dosyalar (opsiyonel)',
      icon: <UploadOutlined />
    }
  ];

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['baslik', 'kategori']);
      } else if (currentStep === 1) {
        await form.validateFields(['aciklama']);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('Lütfen gerekli alanları doldurun');
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const talepOlustur = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/ticket', {
        baslik: values.baslik,
        aciklama: values.aciklama,
        kategori: values.kategori,
        oncelik: values.oncelik || 'Normal'
      });
      if (res.data && res.data.success) {
        message.success('Talep başarıyla oluşturuldu');
        navigate('/talepler');
      } else {
        message.error('Talep oluşturulamadı');
      }
    } catch (err) {
      console.error('Talep oluşturma hatası:', err);
      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error('Talep oluşturulamadı. Lütfen tekrar deneyin.');
      }
    }
    setLoading(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Title level={4} style={{ marginBottom: '24px' }}>
              Temel Bilgiler
            </Title>
            
            <Form.Item
              name="baslik"
              label="Talep Başlığı"
              rules={[
                { required: true, message: 'Lütfen talep başlığını girin!' },
                { min: 5, message: 'Başlık en az 5 karakter olmalıdır!' },
                { max: 100, message: 'Başlık en fazla 100 karakter olabilir!' }
              ]}
            >
              <Input 
                placeholder="Talep başlığını girin" 
                size="large"
                showCount
                maxLength={100}
              />
            </Form.Item>

            <Form.Item
              name="kategori"
              label="Kategori"
              rules={[{ required: true, message: 'Lütfen bir kategori seçin!' }]}
            >
              <Select
                placeholder="Kategori seçin"
                size="large"
                showSearch
                optionFilterProp="children"
              >
                {kategoriSecenekleri.map(kategori => (
                  <Option key={kategori.value} value={kategori.value}>
                    <Space>
                      <span>{kategori.icon}</span>
                      <span>{kategori.label}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        );
      
      case 1:
        return (
          <div>
            <Title level={4} style={{ marginBottom: '24px' }}>
              Detaylar
            </Title>
            
            <Form.Item
              name="aciklama"
              label="Talep Açıklaması"
              rules={[
                { required: true, message: 'Lütfen talep açıklamasını girin!' },
                { min: 20, message: 'Açıklama en az 20 karakter olmalıdır!' }
              ]}
            >
              <TextArea
                placeholder="Talebinizi detaylı bir şekilde açıklayın. Mümkün olduğunca çok bilgi verin."
                rows={6}
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item
              name="oncelik"
              label="Öncelik"
            >
              <Select
                placeholder="Öncelik seçin"
                size="large"
                defaultValue="Normal"
              >
                {oncelikSecenekleri.map(oncelik => (
                  <Option key={oncelik.value} value={oncelik.value}>
                    <Space>
                      <div 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: oncelik.color 
                        }} 
                      />
                      <span>{oncelik.label}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        );
      
      case 2:
        return (
          <div>
            <Title level={4} style={{ marginBottom: '24px' }}>
              Dosya Ekleme 
            </Title>
            
            <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
              Talep ile ilgili ekran görüntüleri, belgeler veya diğer dosyaları ekleyebilirsiniz.
              Maksimum dosya boyutu: 10MB
            </Paragraph>
            
            <Form.Item label="Dosyalar">
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                multiple
                maxCount={5}
              >
                <Button icon={<UploadOutlined />} size="large">
                  Dosya Seç
                </Button>
              </Upload>
            </Form.Item>
          </div>
        );
      
      default:
        return null;
    }
  };
  const stepperStyle = {
    background: '#f7faff',
    borderRadius: 10,
    padding: '18px 24px',
    marginBottom: 24
  };

  return (
    <div className="fade-in">
      <div className="form-container">
        <div className="form-header" style={{ textAlign: 'center', padding: '32px 32px 24px 32px', borderBottom: '1.5px solid #e8e8e8' }}>
          <span className="page-title" style={{ fontSize: 22, fontWeight: 600, color: '#222', marginBottom: 6 }}>Yeni Talep Oluştur</span>
          <div className="page-subtitle" style={{ fontSize: 15, color: '#8c8c8c' }}>
            Destek ekibimiz size en kısa sürede yardımcı olacaktır
          </div>
        </div>

        <div style={stepperStyle}>
          <Steps current={currentStep} size="small">
            {steps.map((step, index) => (
              <Step
                key={index}
                title={<span style={{ fontWeight: 600, fontSize: 15 }}>{step.title}</span>}
                description={<span style={{ fontSize: 13, color: '#8c8c8c' }}>{step.description}</span>}
                icon={step.icon}
              />
            ))}
          </Steps>
        </div>

        <Divider />

        {/*Form içeriği*/}
        <div className="form-content" style={{ padding: 24 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={talepOlustur}
            initialValues={{ oncelik: 'Normal' }}
          >
            {renderStepContent()}

            <div style={{ marginTop: 32, textAlign: 'right' }}>
              <Space>
                {currentStep > 0 && (
                  <Button onClick={handlePrev} size="large" style={{ borderRadius: 8, fontWeight: 500, fontSize: 15, height: 44, minWidth: 100 }}>
                    Geri
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button type="primary" onClick={handleNext} size="large" style={{ borderRadius: 8, fontWeight: 600, fontSize: 16, height: 44, minWidth: 120 }}>
                    İleri
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined style={{ fontSize: 18 }} />}
                    size="large"
                    loading={loading}
                    style={{ borderRadius: 8, fontWeight: 600, fontSize: 16, height: 44, minWidth: 120 }}
                  >
                    Talep Oluştur
                  </Button>
                )}
                <Button
                  onClick={() => navigate('/talepler')}
                  size="large"
                  style={{ borderRadius: 8, fontWeight: 500, fontSize: 15, height: 44, minWidth: 100 }}
                >
                  İptal
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
};

export default TalepOlustur; 