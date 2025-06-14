import styles from './Overview.module.css';
import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Avatar,
  Badge,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  CalendarOutlined,
  VideoCameraOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export const Overview = () => {
  // Hook for navigation
  const navigate = useNavigate();
  // Data for appointments
  const appointments = [
    {
      id: 1,
      name: "Matthew Paul",
      time: "09:00 AM",
      type: "Video Session",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      id: 2,
      name: "Sophia Rodriguez",
      time: "11:30 AM",
      type: "Video Session",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      id: 3,
      name: "David Chen",
      time: "02:00 PM",
      type: "Video Session",
      avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
  ];

  // Data for clients needing attention
  const clientsNeedingAttention = [
    {
      id: 1,
      name: "Sophia Rodriguez",
      issue: "High craving level",
      severity: "high",
    },
    {
      id: 2,
      name: "Michael Johnson",
      issue: "Missed last session",
      severity: "medium",
    },
  ];

  // Data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      name: "Sophia Rodriguez",
      time: "11:30 AM",
      type: "Video Session",
      day: "Tomorrow",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
  ];
  // Function to handle navigation to consultation requests
  const handleConsultationCardClick = () => {
    navigate("/appointments");
  }
  const handleViewAllClientsClick = () => {
    navigate("/clients");
  }

  return (
    <>
      {/* Pending Consultation Requests */}
      <Card
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
          border: "none",
          marginBottom: 24,
          borderRadius: 16,
          cursor: "pointer",
        }}
        bodyStyle={{ padding: 32 }}
        onClick={handleConsultationCardClick}
        hoverable
      >
        <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
          Pending Consultation Requests
        </Title>
        <Title level={1} style={{ color: "#fff", fontSize: 48, margin: "16px 0" }}>
          3
        </Title>
        <Paragraph style={{ color: "#fff", fontSize: 18, margin: 0 }}>
          Click to view and manage requests →
        </Paragraph>
      </Card>

      <Row gutter={24}>
        <Col span={16}>
          {/* Today's Appointments Section */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Title level={3}>Today's Appointments</Title>
              <Card size="small" style={{ borderRadius: 12 }}>
                <Statistic
                  title="Today's Sessions"
                  value="3/5"
                  valueStyle={{ color: "#1890ff", fontSize: 20 }}
                />
              </Card>
            </div>

            {/* Appointment Cards */}
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {appointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  style={{ borderRadius: 12, backgroundColor: "#fafafa" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Space size={16}>
                      <Avatar size={52} src={appointment.avatar}>
                        {appointment.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <div>
                        <Text strong style={{ fontSize: 16 }}>
                          {appointment.name}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                          <Space size={8}>
                            <CalendarOutlined style={{ color: "#666" }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {appointment.time} - {appointment.type}
                            </Text>
                          </Space>
                        </div>
                      </div>
                    </Space>
                    <Badge
                      color="blue"
                      text="Upcoming"
                      style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
                    />
                  </div>
                  <div style={{ marginTop: 16, textAlign: "right" }}>
                    <Button
                      type="default"
                      icon={<VideoCameraOutlined />}
                      style={{ borderRadius: 8 }}
                    >
                      Join Google Meet
                    </Button>
                  </div>
                </Card>
              ))}
            </Space>
          </div>
        </Col>

        <Col span={8}>
          {/* Clients Needing Attention */}
          <Card
            title={
              <Space>
                <ExclamationCircleOutlined />
                <Text strong>Clients Needing Attention</Text>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 12 }}
            bodyStyle={{ backgroundColor: "#fafafa" }}
            onClick={handleViewAllClientsClick}
            hoverable  // Add hover effect
          >
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {clientsNeedingAttention.map((client) => (
                <Card
                  key={client.id}
                  size="small"
                  style={{
                    backgroundColor: client.severity === "high" ? "#fef2f2" : "#fef9e7",
                    border: `1px solid ${
                      client.severity === "high" ? "#fecaca" : "#fde68a"
                    }`,
                    borderRadius: 8,
                  }}
                >
                  <Text strong style={{ fontSize: 12 }}>
                    {client.name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {client.issue}
                  </Text>
                </Card>
              ))}
            </Space>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button type="link" style={{ color: "#0d9488" }}>
                View all clients →
              </Button>
            </div>
          </Card>

          {/* Upcoming Appointments */}
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Space>
                  <CalendarOutlined />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tomorrow
                  </Text>
                </Space>
                <Badge color="blue" text="Upcoming" />
              </div>
            }
            style={{ borderRadius: 12 }}
            bodyStyle={{ backgroundColor: "#fafafa" }}
          >
            {upcomingAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                size="small"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #d9d9d9",
                  borderRadius: 8,
                }}
              >
                <Space size={12}>
                  <Avatar size={32} src={appointment.avatar}>
                    {appointment.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: 12 }}>
                      {appointment.name}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {appointment.time} - {appointment.type}
                    </Text>
                  </div>
                </Space>
              </Card>
            ))}
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default Overview;