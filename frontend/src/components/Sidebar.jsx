import React from "react";
import { Layout, Menu } from "antd";
import {
  HomeFilled,
  SettingFilled,
  FilterFilled,
  ApartmentOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  LineChartOutlined,
  QuestionCircleFilled,
  ContactsOutlined,
  RobotFilled,
} from "@ant-design/icons";
import { Link, useLocation} from "react-router-dom";

const { Sider } = Layout;

const sidebarItems = [
  { key: "/", icon: <HomeFilled />, label: "Talepler" },
  { key: "/filters", icon: <FilterFilled />, label: "Filtreler" },
  { key: "/user-filters", icon: <ContactsOutlined />, label: "Kullanıcı Filtreleri" },
  { key: "/org-filters", icon: <ApartmentOutlined />, label: "Organizasyon Filtreleri" },
  { key: "/customers", icon: <UsergroupAddOutlined />, label: "Müşteriler" },
  { key: "/organizations", icon: <ApartmentOutlined />, label: "Organizasyonlar" },
  { key: "/reports", icon: <BarChartOutlined />, label: "Raporlar" },
  { key: "/advanced-reports", icon: <LineChartOutlined />, label: "Gelişmiş Raporlar" },
  { key: "/settings", icon: <SettingFilled />, label: "Ayarlar" },
];
const sidebarItemsalt = [
  { key: "/ai-assistant", icon: <RobotFilled />, label: "AI Asistanı" },
  { key: "/help-center", icon: <QuestionCircleFilled />, label: "Yardım Merkezi" },
];

const Sidebar = () => {
  const location = useLocation();

  const mapItems = (items) =>
    items.map((item) => ({
      key: item.key,
      icon: React.cloneElement(item.icon, {
        style: { fontSize: 16, color: "white" },
      }),
      label: <Link to={item.key} title={item.label} />, 
      className: "custom-menu-item",
    }));

  return (
    <Sider width={60} className="custom-sider">
      <Menu
        mode="vertical"
        selectedKeys={[location.pathname]}
        className="custom-menu" 
        items={mapItems(sidebarItems)}
      />
      <div className="sidebar-spacer" /> 
      <div className="bottom-menu-container"> 
      <Menu
        mode="vertical"
        selectedKeys={[location.pathname]}
        className="custom-menu bottom-menu" 
        items={mapItems(sidebarItemsalt)}
      />
      </div>
    </Sider> 
  );
};

export default Sidebar;