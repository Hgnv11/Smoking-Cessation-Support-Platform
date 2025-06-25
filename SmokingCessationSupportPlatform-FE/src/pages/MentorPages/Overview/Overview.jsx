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
  List,
  Tag,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { scheduleData } from "../../../services/scheduleDataOverviewCoach"; // Import scheduleData
import googleMeetLogo from "../../../assets/image-1-2.png"

const { Title, Text, Paragraph } = Typography;

export const Overview = () => {
  // Hook for navigation
  const navigate = useNavigate();

  // Calculate total booked slots from scheduleData
  const totalBookedSlots = scheduleData.reduce((total, day) => {
    return total + day.timeSlots.filter(slot => !slot.isAvailable).length;
  }, 0);

  // Data for appointments (can be removed if not used elsewhere or derived from scheduleData)
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

  // Data for tomorrow's appointments
  const tomorrowAppointments = scheduleData[1]?.timeSlots.filter(slot => !slot.isAvailable).map(slot => ({
    time: slot.time,
    clientName: slot.clientName, // Assuming clientName is available in slot data
    type: slot.type,
  })) || [];

  // Function to handle navigation to consultation requests
  const handleConsultationCardClick = () => {
    navigate("/appointments");
  }
  const handleViewAllClientsClick = () => {
    navigate("/clients");
  }

  // Function to handle navigation for the upcoming appointments card
  const handleUpcomingAppointmentsCardClick = () => {
    navigate("/appointments"); // Navigate to the 'Manage Appointments' page
  };

  return (
    <>
      {/* Pending Consultation Requests - This is the card to be updated */}
      {/* Renaming to DashboardUpcomingAppointmentsCard for clarity based on request */}      <Card
        className={styles.dashboardUpcomingAppointmentsCard}
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
          border: "none",
          marginBottom: 24,
          borderRadius: 16,
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        styles={{ 
          body: { padding: 32 },
          // Thêm hiệu ứng hover
          root: {
            '&:hover': {
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-3px)"
            }
          }
        }}
        onClick={handleUpcomingAppointmentsCardClick}
        hoverable
      >
        {/* Thêm icon lịch cho tiêu đề */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <CalendarOutlined style={{ fontSize: 24, color: "#fff", marginRight: 12 }} />
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            Upcoming Appointments / Booked Slots
          </Title>
        </div>
        
        {/* Số lượng với context */}
        <div style={{ display: "flex", alignItems: "baseline", margin: "16px 0" }}>
          <Title level={1} style={{ color: "#fff", fontSize: 48, margin: 0 }}>
            {totalBookedSlots}
          </Title>
          <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 20, marginLeft: 8 }}>
            slots booked
          </Text>
        </div>
        
        {/* Call-to-action với độ mờ nhẹ */}
        <Paragraph style={{ 
          color: "rgba(255, 255, 255, 0.9)", 
          fontSize: 18, 
          margin: 0,
          display: "flex",
          alignItems: "center"
        }}>
          Click to manage appointments 
          <span style={{ marginLeft: 4, fontSize: 20 }}>→</span>
        </Paragraph>
      </Card>

      <Row gutter={24}>
        <Col span={16}>
          {/* Today's Appointments Section */}
          <div style={{ marginBottom: 24 }}>            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Title level={2}>Today's Appointments</Title>
              <Card size="small" style={{ borderRadius: 12, padding: "8px 12px" }}>
                <Statistic
                  title="Today's Sessions"
                  value="3/5"
                  valueStyle={{ color: "#1890ff", fontSize: 24 }}
                  titleStyle={{ fontSize: 16 }}
                />
              </Card>
            </div>

            {/* Appointment Cards */}
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
              {appointments.map((appointment) => (                <Card
                  key={appointment.id}
                  style={{ borderRadius: 12, backgroundColor: "#fafafa", padding: "8px" }}
                  bodyStyle={{ padding: "20px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Space size={20}>
                      <Avatar size={64} src={appointment.avatar}>
                        {appointment.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <div>
                        <Text strong style={{ fontSize: 18 }}>
                          {appointment.name}
                        </Text>
                        <div style={{ marginTop: 10 }}>
                          <Space size={10}>
                            <CalendarOutlined style={{ color: "#666", fontSize: 16 }} />
                            <Text type="secondary" style={{ fontSize: 14 }}>
                              {appointment.time} - {appointment.type}
                            </Text>
                          </Space>
                        </div>
                      </div>
                    </Space>
                    <Badge
                      color="blue"
                      text="Upcoming"
                      style={{ 
                        backgroundColor: "#e6f7ff", 
                        color: "#1890ff", 
                        fontSize: 14,
                        padding: "4px 12px",
                        borderRadius: "12px"
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 20, textAlign: "right" }}>
                    {/* Button to join Google Meet */}
                    <Button
                      type="default"
                      icon={<img src={googleMeetLogo} alt="Join Meet" style={{ width: 22, height: 22, marginRight: 8 }} />}
                      style={{
                        borderRadius: 8,
                        backgroundColor: '#0d9488',
                        color: '#fff',
                        borderColor: '#0d9488',
                        height: "40px",
                        padding: "0 20px",
                        fontSize: "15px"
                      }}
                    >
                      <b>Join Google Meet</b>
                    </Button>
                  </div>
                </Card>
              ))}
            </Space>
          </div>
        </Col>

        <Col span={8}>
          {/* Clients Needing Attention */}          <Card
            title={
              <Space>
                <ExclamationCircleOutlined />
                <Text strong>Clients Needing Attention</Text>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 12 }}
            styles={{ body: { backgroundColor: "#fafafa" } }}
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

          {/* Tomorrow's Appointments Section */}
          <Card
            title={<Title level={5}>Tomorrow's Schedule</Title>}
            className={styles.tomorrowCard}
            style={{ 
              height: "51.8%", // chiều cao của thẻ
              borderRadius: 12 
            }}
            bordered={false}
            bodyStyle={{ padding: "16px" }}
          >
            {tomorrowAppointments.length > 0 ? (
              <>
                <List
                  dataSource={tomorrowAppointments}
                  renderItem={appointment => (
                    <List.Item style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <Space align="start">
                        <Tag color="#0d9488" style={{ marginRight: 8, fontSize: 12 }}>{appointment.time}</Tag>
                        <div>
                          <Text strong>{appointment.clientName}</Text>
                          <div><Text type="secondary">{appointment.type}</Text></div>
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <Button type="primary" size="small" onClick={() => navigate("/appointments")}>
                    View Full Schedule
                  </Button>
                </div>
              </>
            ) : (
              <Empty
                description={
                  <span>
                    No appointments scheduled for tomorrow
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default Overview;