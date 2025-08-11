import React,{useState} from "react";
import {Card,Form,Input,Button,Typography,message,Alert} from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

const {Title,Text,Paragraph}=Typography;

const Login=()=>{
  const [form]=Form.useForm();
  const navigate=useNavigate();
  const {login}=useAuth();
  const [loading,setLoading]=useState(false);

  const onFinish=async(values)=>{
    setLoading(true);
    try{
      const success=await login(values.email,values.password);
      if(success){
        message.success('Başarıyla giriş yapıldı.');
        navigate('/talepler');
      }

    }catch(error){
      message.error(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu.');
    } finally{
      setLoading(false);
    }
  };
  return(
    <div className="page-container">
      <div style={{
        minHeight:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'24px'
      }}>
        <Card style={{
          maxWidth:'400px',
          borderRadius:'16px',
        }}>
          <div style={{
            textAlign:'center',
            marginBottom:32
          }}>
            <div style={{
              width:64,
              height:64,
              background:'linear-gradient(45deg, #FFE066 0%, #FF6F00 25%, #6A1B9A  100%)',
              borderRadius:'16px',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              margin:'0 auto 16px',
            }}>
              <LoginOutlined style={{
                fontSize:'32px',
                color:'white'
              }}/>
            </div>
            <Title level={2}>Hoş Geldiniz</Title>
            <Text type="secondary">Grispi Customer Portal'a Giriş Yapın</Text>
          </div>
          <Alert message="Örnek Kullanıcı Bilgileri" description={
            <div>
              <Text strong>
                E-posta: 
              </Text> grispi@grispi.com.tr
              <br/>
              <Text strong>
                Şifre: 
              </Text> 123456
            </div>
          } type="info" showIcon icon={<InfoCircleOutlined/>}/>
          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
            <Form.Item name="email" label="E-posta" rules={[
              {required:true, message:'E-posta adresinizi girin.'},
              {type:'email', message:'Geçerli bir e-posta adresi girin'}
            ]}>
              <Input prefix={<UserOutlined/>} placeholder="ornek@email.com"/>
            </Form.Item>
            <Form.Item name="password" label="şifre" rules={[
              {required:true,message:'Şifrenizi girin'},
              {min:6,message:'Şifre en az 6 karakter olmalı'}
            ]}>
              <Input.Password prefix={<LockOutlined/>} placeholder="Şifreniz"/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<LoginOutlined/>} style={{width:'100%'}}>
                {loading ? 'Giriş Yapılıyor..':'Giriş Yap'}
              </Button>
            </Form.Item>
          </Form>
          <div style={{textAlign:'center', marginTop:24}}>
            <Paragraph>
              Hesabınız yok mu? Sistem yöneticisi ile iletişime geçin.
            </Paragraph>
            <Text type="secondary" style={{fontSize:'12px'}}>
              Grispi Customer Portal
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}
export default Login;
