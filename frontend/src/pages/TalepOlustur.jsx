import React from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Tooltip,
  Space,
  Typography
} from 'antd';
import {
  UploadOutlined,
  UndoOutlined,
  RedoOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  LinkOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  BgColorsOutlined,
  PaperClipOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import api from '../utils/axios';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TalepOlustur = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('talepTuru', values.talepTuru);
    formData.append('konu', values.konu);
    formData.append('aciklama', values.aciklama);

    if (values.ekler) {
      values.ekler.forEach((file) => {
        formData.append('ekler', file.originFileObj);
      });
    }

    try {
      await api.post('/api/talepler', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success('Talebiniz başarıyla gönderildi.');
      form.resetFields();
    } catch (error) {
      message.error('Bir hata oluştu. Tekrar deneyin.');
    }
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '0 auto',
        background: '#fff',
        padding: 32,
        borderRadius: 8
      }}
    >
      <Title level={3} style={{ marginBottom: 4 }}>
        Yeni Talep
      </Title>
      <Paragraph style={{ color: '#666', marginBottom: 24 }}>
        Lütfen talebinizi destek ekibimize iletmek için aşağıdaki formu doldurun.
      </Paragraph>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Talebiniz Nedir?"
          name="talepTuru"
          rules={[{ required: true, message: 'Talep türünü seçin' }]}
        >
          <Select placeholder="Talep türünü seçin">
            <Option value="teknik">Teknik Sorun</Option>
            <Option value="faturalama">Faturalama</Option>
            <Option value="genel">Genel Bilgi</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <span>
              *Konu{' '}
              <Tooltip title="Kısa ve net bir konu giriniz.">
                <InfoCircleOutlined
                  style={{ color: 'rgba(0,0,0,0.45)', marginLeft: 4 }}
                />
              </Tooltip>
            </span>
          }
          name="konu"
          rules={[{ required: true, message: 'Konuyu girin' }]}
        >
          <Input placeholder="Konu giriniz" />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Ekler{' '}
              <Tooltip title="Dosya yüklemek için tıklayın.">
                <InfoCircleOutlined
                  style={{ color: 'rgba(0,0,0,0.45)', marginLeft: 4 }}
                />
              </Tooltip>
            </span>
          }
          name="ekler"
          valuePropName="fileList"
        >
          <Upload beforeUpload={() => false} multiple>
            <Button icon={<UploadOutlined />}>Yüklemek için tıklayın</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label={
            <span>
              *Açıklama{' '}
              <Tooltip title="Talebinizle ilgili detaylı açıklama giriniz.">
                <InfoCircleOutlined
                  style={{ color: 'rgba(0,0,0,0.45)', marginLeft: 4 }}
                />
              </Tooltip>
            </span>
          }
          name="aciklama"
          rules={[{ required: true, message: 'açıklama girin' }]}
        >
          <>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                padding: '4px 0',
                borderBottom: '1px solid #ddd',
                marginBottom: 8
              }}
            >
              <Tooltip title="Geri Al"><Button icon={<UndoOutlined />} /></Tooltip>
              <Tooltip title="İleri Al"><Button icon={<RedoOutlined />} /></Tooltip>
              <Select defaultValue="Normal" style={{ width: 100 }}>
                <Option value="normal">Normal</Option>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
              </Select>
              <Tooltip title="Kod Görünümü"><Button icon={<span>{'</>'}</span>} /></Tooltip>
              <Tooltip title="Kalın"><Button icon={<BoldOutlined />} /></Tooltip>
              <Tooltip title="İtalik"><Button icon={<ItalicOutlined />} /></Tooltip>
              <Tooltip title="Altı Çizili"><Button icon={<UnderlineOutlined />} /></Tooltip>
              <Tooltip title="Üstü Çizili"><Button icon={<StrikethroughOutlined />} /></Tooltip>
              <Tooltip title="Bağlantı"><Button icon={<LinkOutlined />} /></Tooltip>
              <Tooltip title="Numaralı Liste"><Button icon={<OrderedListOutlined />} /></Tooltip>
              <Tooltip title="Madde Listesi"><Button icon={<UnorderedListOutlined />} /></Tooltip>
              <Tooltip title="Sola Hizala"><Button icon={<AlignLeftOutlined />} /></Tooltip>
              <Tooltip title="Ortala"><Button icon={<AlignCenterOutlined />} /></Tooltip>
              <Tooltip title="Sağa Hizala"><Button icon={<AlignRightOutlined />} /></Tooltip>
              <Tooltip title="Metin Rengi"><Button icon={<BgColorsOutlined />} /></Tooltip>
              <Tooltip title="Dosya Ekle"><Button icon={<PaperClipOutlined />} /></Tooltip>
              <Tooltip title="Çizim"><Button icon={<span style={{ fontSize: 16 }}>✏️</span>} /></Tooltip>
            </div>

            <TextArea
              rows={5}
              placeholder="Talebinizle ilgili detaylı açıklama giriniz"
            />
          </>
        </Form.Item>


        <Form.Item style={{ textAlign: 'center' }}>
          <Button className='save-btn'
            type="primary"
            htmlType="submit"
            style={{ background: '#6A1B9A', minWidth: 120 }}
          >
            Gönder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TalepOlustur;
