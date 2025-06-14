import React from "react";
import { Layout as AntLayout, Avatar, Button, Typography, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogoutOutlined,
  BookOutlined,
  PieChartOutlined,
  StarOutlined,
  BarChartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = AntLayout;
const { Text } = Typography;

export const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    {
      key: "overview",
      icon: <PieChartOutlined />,
      label: "Overview",
      path: "/overview",
    },
    {
      key: "appointments",
      icon: <StarOutlined />,
      label: "Appointments",
      path: "/appointments",
    },
    {
      key: "clients",
      icon: <BookOutlined />,
      label: "Clients",
      path: "/clients",
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: "Reports",
      path: "/reports",
    },
  ];

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    const currentItem = sidebarItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.label : "Overview";
  };

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        width={240}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ padding: "24px 16px" }}>
          {/* Profile Section */}
          <div style={{ marginBottom: 32 }}>
            <Space align="center" style={{ marginBottom: 8 }}>
              <Avatar
                size={32}
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop"
                style={{ backgroundColor: "#0d9488" }}
              >
                CQ
              </Avatar>
              <div>
                <Text strong>Coach QuitIt</Text>
              </div>
            </Space>
            <Text type="secondary" style={{ fontSize: 12, paddingLeft: 8 }}>
              Smoking Cessation Coach
            </Text>
          </div>

          {/* Navigation */}
          <div style={{ marginBottom: 24 }}>
            <Text type="secondary" style={{ fontSize: 12, paddingLeft: 8 }}>
              DASHBOARDS
            </Text>
            <div style={{ marginTop: 8 }}>
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (location.pathname === "/" && item.path === "/overview");
                
                return (
                  <div
                    key={item.key}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      marginBottom: 4,
                      backgroundColor: isActive ? "#f0f9ff" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon}
                    <Text style={{ color: isActive ? "#0d9488" : "#666" }}>
                      {item.label}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logout Button */}
          <div style={{ position: "absolute", bottom: 24, left: 16, right: 16 }}>
            <Button
              danger
              type="primary"
              icon={<LogoutOutlined />}
              block
              style={{ borderRadius: 8 }}
            >
              Log out
            </Button>
          </div>
        </div>
      </Sider>

      <AntLayout style={{ marginLeft: 240 }}>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "fixed",
            width: "calc(100% - 240px)",
            zIndex: 99,
          }}
        >
          <Space>
            <Text type="secondary">Dashboards</Text>
            <Text type="secondary">/</Text>
            <Text strong>{getCurrentPageTitle()}</Text>
          </Space>
          <Button type="text" icon={<CalendarOutlined />} />
        </Header>

        {/* Main Content */}
        <Content style={{ padding: 24, marginTop: 64 }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};