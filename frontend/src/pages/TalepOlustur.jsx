import React, { useRef, useState } from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    Upload,
    message,
    Tooltip,
    Space,
    Typography,
    Spin
} from 'antd';
import {
    UploadOutlined,
    InfoCircleOutlined,
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
} from '@ant-design/icons';
import api from '../utils/axios'; 
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const TalepOlustur = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false); 

    const handleFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        form.setFieldsValue({ aciklama: editorRef.current.innerHTML });
    };

    const handleLink = () => {
        const url = prompt('Lütfen URL adresini girin:');
        if (url) {
            handleFormat('createLink', url);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('talepTuru', values.oncelik || 'Orta');
            formData.append('konu', values.konu);
            formData.append('aciklama', editorRef.current.innerHTML);
            
            if (values.ekDosyalar && values.ekDosyalar.length > 0) {
                values.ekDosyalar.forEach(file => {
                    formData.append('ekler', file.originFileObj);
                });
            }
            const response = await api.post('/ticket', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                messageApi.success('Talep başarıyla oluşturuldu!');
                form.resetFields(); 
                navigate('/talepler'); 
            } else {
                messageApi.error('Talep oluşturulurken bir hata oluştu.');
            }
        } catch (error) {
            console.error('API hatası:', error);
            messageApi.error(error.response?.data?.message || 'Talep oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const customRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    return (
        <div className="form-page-container">
            {contextHolder}
            <Title level={2} className="form-page-title">Yeni Talep Oluştur</Title>
            <Paragraph type="secondary" className="form-page-description">
                Aşağıdaki formu doldurarak yeni bir destek talebi oluşturabilirsiniz.
            </Paragraph>

            <Form
                form={form}
                name="talep_olusturma_formu"
                onFinish={handleSubmit} 
                layout="vertical"
                initialValues={{
                    oncelik: 'orta',
                }}
            >
                <Form.Item
                    label="Talep Konusu"
                    name="konu"
                    rules={[{ required: true, message: 'Lütfen talep konusunu giriniz!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={
                        <Space>
                            Öncelik
                            <Tooltip title="Talebinizin aciliyet seviyesini belirtir.">
                                <InfoCircleOutlined className="label-icon" />
                            </Tooltip>
                        </Space>
                    }
                    name="oncelik"
                    rules={[{ required: true, message: 'Lütfen öncelik seçiniz!' }]}
                >
                    <Select placeholder="Öncelik seçin">
                        <Option value="yuksek">Yüksek</Option>
                        <Option value="orta">Orta</Option>
                        <Option value="dusuk">Düşük</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Açıklama"
                    name="aciklama"
                    rules={[{ required: true, message: 'Lütfen talebinizi detaylı bir şekilde açıklayınız!' }]}
                >
                    <div className="rich-text-editor">
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
                    </div>
                </Form.Item>

                <Form.Item
                    label="Ek Dosyalar"
                    name="ekDosyalar"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        return e && e.fileList;
                    }}
                >
                    <Upload
                        name="file"
                        customRequest={customRequest}
                        multiple
                        listType="picture"
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>Dosya Seç</Button>
                    </Upload>
                </Form.Item>

                <Form.Item className="submit-item">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="submit-button"
                        loading={loading} 
                    >
                        {loading ? <Spin /> : 'Talebi Oluştur'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default TalepOlustur;