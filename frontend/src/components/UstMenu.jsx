import React, {useEffect, useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Dropdown,
  Badge,
  Tooltip,
  Drawer,
  Input,
  Divider,
  Space,
  Modal,
  Form,
  Select,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UserSwitchOutlined,
  MessageOutlined,
  PhoneOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  RestOutlined,
  TeamOutlined,
  BookOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import axios from "axios";

const {Option}=Select;
const {Header } = Layout;
const {Text}=Typography;

const KullaniciModal = ({ open, onClose }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Kullanıcı form values:", values);
      onClose();
      form.resetFields();
    } catch (err) {}
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title="Kullanıcı Oluştur"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Oluştur"
      cancelText="İptal"
      centered
      maskClosable={false}
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          role: "son-kullanici",
        }}
      >
        <Form.Item label={<Text strong>Rol</Text>} name="role" tooltip="Kullanıcının rolünü seçin">
          <Select>
            <Option value="son-kullanici">Son Kullanıcı</Option>
    
          </Select>
        </Form.Item>

        <Form.Item
          label="E-posta"
          name="email"
          rules={[
            { required: true, message: "E-posta giriniz" },
            { type: "email", message: "Geçerli bir e-posta giriniz" },
          ]}
        >
          <Input placeholder="ornek@domain.com" />
        </Form.Item>

        <Form.Item
          label="Ad Soyad"
          name="fullname"
          rules={[{ required: true, message: "Ad soyad giriniz" }]}
        >
          <Input placeholder="Ad Soyad" />
        </Form.Item>

        <Form.Item
          label="Telefon"
          name="phone"
          rules={[{ required: true, message: "Telefon giriniz" }]}
        >
          <PhoneInput
            country={"tr"}
            preferredCountries={["tr", "us", "gb"]}
            enableSearch
            disableCountryCode={false}
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: false,
            }}
            containerStyle={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
            onChange={(value, data) => {
              form.setFieldsValue({ phone: "+" + value.replace(/[^0-9]/g, "") });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const OrganizasyonModal=({open,onClose})=>{
  const [form]=Form.useForm();
  const handleOk= async ()=>{
    try {
      const values=await form.validateFields();
      console.log("Organizasyon form values:", values);
      onClose();
      form.resetFields();
    } catch (err) {}
  };
  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title="Organizasyon Oluştur"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Oluştur"
      cancelText="İptal"
      centered
      maskClosable={false}
      width={520}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Organizasyon Adı"
          name="orgName"
          rules={[{ required: true, message: "Organizasyon adı giriniz" }]}
        >
          <Input placeholder="Organizasyon adı" />
        </Form.Item>

        <Form.Item label="Açıklama" name="description">
          <Input.TextArea placeholder="Açıklama" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const UstMenu=()=>{
  const [menuItems,setMenuItems]=useState([]);
  const [isTalepAraOpen,setIsTalepAraOpen]=useState(false);
  const [activeTab,setActiveTab]=useState("simple");
  const navigate=useNavigate();

  useEffect(()=>{
    const fetcMenu=async()=>{
      try{
        const res=await axios.get("http://localhost:5000/api/menu");
        setMenuItems(res.data);
      }catch(err){
        console.error("Menü yüklenemedi: ", err);
      }
    };
    fetcMenu();
  }, []);
  const handleClick=(e)=>{
    navigate(e.key);
  };

  const location=useLocation();
  const { user,logout}=useAuth();
  const [tabs, setTabs] = useState([{ key: "/talepler", label: "Talepler" }]);
  const [activeKey, setActiveKey] = useState("/talepler");
  const [notifications, setNotifications] = useState([]);
  const [selectedStatusKey, setSelectedStatusKey] = useState("office");

  const [isKullaniciOpen, setIsKullaniciOpen] = useState(false);
  const [isOrganizasyonOpen, setIsOrganizasyonOpen] = useState(false);

  const statusOptions = [
    { key: "offline", icon: <UserSwitchOutlined />, label: "Çevrim dışı" },
    { key: "office", icon: <UserOutlined />, label: "Ofiste" },
    { key: "chat", icon: <MessageOutlined />, label: "Chat" },
    { key: "allCalls", icon: <PhoneOutlined />, label: "Tüm çağrılar" },
    { key: "incoming", icon: <ArrowDownOutlined />, label: "Gelen çağrılar" },
    { key: "outgoing", icon: <ArrowUpOutlined />, label: "Giden çağrılar" },
    { key: "afterCall", icon: <ClockCircleOutlined />, label: "Çağrı sonrası" },
    { key: "allCallsChat", icon: <PhoneOutlined />, label: "Tüm çağrılar + Chat" },
    { key: "incomingChat", icon: <ArrowDownOutlined />, label: "Gelen çağrılar + Chat" },
    { key: "outgoingChat", icon: <ArrowUpOutlined />, label: "Giden çağrılar + Chat" },
    { key: "afterCallChat", icon: <ClockCircleOutlined />, label: "Çağrı sonrası + Chat" },
    { key: "break", icon: <CoffeeOutlined />, label: "Mola" },
    { key: "lunch", icon: <RestOutlined />, label: "Yemek" },
    { key: "meeting", icon: <TeamOutlined />, label: "Toplantı" },
    { key: "training", icon: <BookOutlined />, label: "Eğitim" },
  ];

  const statusColors=useMemo(
    ()=>({
      offline: { bg: "#f5222d", fg: "#fff", hover: "#ff7875" },
      break: { bg: "#fa8c16", fg: "#fff", hover: "#ffa940" },
      lunch: { bg: "#fa8c16", fg: "#fff", hover: "#ffa940" },
      meeting: { bg: "#fa8c16", fg: "#fff", hover: "#ffa940" },
      training: { bg: "#fa8c16", fg: "#fff", hover: "#ffa940" },
      office: { bg: "#52c41a", fg: "#fff", hover: "#73d13d" },
      chat: { bg: "#6a1b9a", fg: "#fff", hover: "#9254de" },
      allCalls: { bg: "#6a1b9a", fg: "#fff", hover: "#9254de" },
      incoming: { bg: "#6a1b9a", fg: "#fff", hover: "#9254de" },
      outgoing: { bg: "#6a1b9a", fg: "#fff", hover: "#9254de" },
      afterCall: { bg: "#6a1b9a", fg: "#fff", hover: "#9254de" },
      allCallsChat: { bg: "#6a1b9a", fg: "#fff", hover: "#9254de" },
      incomingChat: { bg: "#6a1b9a", fg: "#fff", hover: "#9254de" },
      outgoingChat: { bg: "#6a1b9a", fg: "#fff", hover: "#9254de" },
      afterCallChat: { bg: "#6a1b9a", fg: "#fff", hover: "#9254de" },
    }),
    []
  );

  const selectedStatus = statusOptions.find((s) => s.key === selectedStatusKey)?.label || "";
  const selectedStyle = statusColors[selectedStatusKey] || { bg: "#6a1b9a", fg: "#fff" };

  const statusMenu = {
    items: statusOptions.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
    })),
    onClick: ({ key }) => setSelectedStatusKey(key),
  };

  const notificationMenu = {
    items: [
      {
        key: "header",
        label: <Text strong>Bildirimler</Text>,
        disabled: true,
      },
      { type: "divider" },
      ...(notifications.length
        ? notifications.map((n, idx) => ({
            key: String(idx),
            label: n,
          }))
        : [
            {
              key: "empty",
              disabled: true,
              label: "Yeni bildirim yok",
            },
          ]),
    ],
  };

  const getUserInitials = () => {
    return "GG";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "user-info",
      disabled: true,
      label: (
        <div style={{ padding: 8, display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 35,
              height: 35,
              background: "#6A1B9A",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
              color: "white",
              fontWeight: "bold",
              fontSize: "12",
            }}
          >
            {getUserInitials()}
          </div>
          <div>
            <Text strong>Grispi Grispi</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email}
            </Text>
          </div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profili Düzenle",
      onClick: () => navigate("/profil"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Çıkış Yap",
      onClick: handleLogout,
    },
  ];

  const handleOpenTab=(path,label)=> {
    if (!tabs.find((t)=>t.key===path)){
      setTabs([...tabs, {key:path,label}]);
    }
    setActiveKey(path);
    navigate(path);
  };

  const handleCloseTab = (key) => {
    const newTabs = tabs.filter((t) => t.key !== key);
    setTabs(newTabs);
    if (activeKey === key) {
      setActiveKey("/talepler");
      navigate("/talepler");
    }
  };

  return (
    <>
      <Header className="custom-header" style={{ display: 'flex',justifyContent:'space-between', alignItems:'center'}}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Menu mode="horizontal" selectable={false} className="main-menu" items={menuItems} onClick={handleClick}
      style={{flex:1, minWidth:0}}/>
          <Dropdown
            menu={{
              items: [
                {
                  key: "/talep-olustur",
                  label: "Talep",
                  onClick: () => handleOpenTab("/talep-olustur", "Talep"),
                },
                {
                  key: "/kullanici-ekle",
                  label: "Kullanıcı",
                  onClick: () => {
                    setIsKullaniciOpen(true);
                    handleOpenTab("/kullanici-ekle", "Kullanıcı");
                  },
                },
                {
                  key: "/organizasyon-ekle",
                  label: "Organizasyon",
                  onClick: () => {
                    setIsOrganizasyonOpen(true);
                    handleOpenTab("/organizasyon-ekle", "Organizasyon");
                  },
                },
              ],
            }}
          >
            <Button className="add-button" icon={<PlusOutlined />}>
              Ekle
            </Button>
          </Dropdown>
        </div>
        <div style={{display: "flex",gap:4}}>
          {tabs.map((tab)=>(
            <div
              key={tab.key}
              style={{
                display:"flex",
                alignItems:"center",
                gap:4,
                padding:"4px 8px",
                borderBottom:activeKey===tab.key?"2px solid #cc2ac4ff":"none",
                cursor: "pointer",
                transition: "border-bottom 0.3s",

              }}
                onClick={() => {
                  setActiveKey(tab.key);
                  navigate(tab.key);
                }}
                >
              <span>
                {tab.label}
              </span>
              {tab.key !== "/talepler" && (
                <span style={{fontWeight:"bold", marginLeft: 4}} onClick={(e)=>{
                  e.stopPropagation();
                  handleCloseTab(tab.key);}}>
                  x
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="right-menu" style={{display: "flex", gap: 4, alignItems: "center"}}>
          <Dropdown menu={statusMenu} placement="bottomRight" trigger={["click"]}>
            <Button
              type="primary"
              icon={<UserOutlined />}
              style={{
                backgroundColor: selectedStyle.bg,
                borderColor: selectedStyle.bg,
                color: selectedStyle.fg,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = selectedStyle.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedStyle.bg)}
            >
              {selectedStatus}
            </Button>
          </Dropdown>

          <Dropdown menu={notificationMenu} placement="bottomRight" trigger={["click"]}>
            <Tooltip>
              <Badge count={notifications.length} size="small">
                <Button type="text" icon={<BellOutlined style={{ fontSize: "16px" }} />} size="large" />
              </Badge>
            </Tooltip>
          </Dropdown>

          <Tooltip title="Talep Ara">
            <Button
              type="text"
              icon={<SearchOutlined style={{fontSize:16}} />}
              size="large"
              onClick={()=> setIsTalepAraOpen(true)}
            />
          </Tooltip>

          <Dropdown menu={{items:userMenuItems }} placement="bottomRight">
            <div style={{marginRight:"16px" }} className="user-menu-avatar">
              <Text style={{color:"white", fontSize: 16 }}>{getUserInitials()}</Text>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Drawer title="Talep Ara" placement="right" width={600} onClose={() => setIsTalepAraOpen(false)} open={isTalepAraOpen}>
        <div style={{display:"flex", marginBottom:16}}>
          <Button type={activeTab==="simple" ? "primary":"default"}
          onClick={()=>setActiveTab("simple")} style={{flex:1}}>
            Basit Talep Araması
          </Button>
          <Button type={activeTab==="advanced" ? "primary": "default"}
          onClick={()=>setActiveTab("advanced")} style={{flex:1}}>
            Gelişmiş Talep Araması
          </Button>
        </div>
        {activeTab==="simple" &&(
          <>
          <Input.Search placeholder="Talep Ara" allowClear enterButton="Ara"/>
          <Divider/>
          <table style={{width:"100%", textAlign:"left"}}>
            <thead>
              <tr>
                <th>Talep No</th>
                <th>Konu</th>
                <th>Talep Eden</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} style={{textAlign:"center", padding:16}}>
                  Veri Yok
                </td>
              </tr>
            </tbody>
          </table>
          </>
        )}
        {activeTab==="advanced" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Text type="secondary">Kendi koşullarınızı tanımlayarak gelişmiş bir talep araması gerçekleştirebilirsiniz.</Text>
              <Button icon={<PlusOutlined />} type="dashed" block>
                Arama Koşulu Ekle
              </Button>
              <Divider />
              <table style={{width:"100%", textAlign:"left"}}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px 0" }}>Talep No</th>
                    <th style={{ padding: "8px 0" }}>Konu</th>
                    <th style={{ padding: "8px 0" }}>Talep Eden</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} style={{textAlign:"center", padding:16}}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 100, height: 100, background: '#f0f0f0', borderRadius: 8, marginBottom: 8 }} /> {/* Placeholder for image */}
                        Veri Yok
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}        
      </Drawer>

      <KullaniciModal open={isKullaniciOpen} onClose={() => setIsKullaniciOpen(false)} />
      <OrganizasyonModal open={isOrganizasyonOpen} onClose={() => setIsOrganizasyonOpen(false)} />
    </>
  );
};

export default UstMenu;
