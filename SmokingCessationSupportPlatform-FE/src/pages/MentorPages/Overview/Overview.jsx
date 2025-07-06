import styles from "./Overview.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Spin,
  Alert,
} from "antd";
import { CalendarOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import api from "../../../config/axios";

const { Title, Text, Paragraph } = Typography;

export const MentorOverview = () => {
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/consultations/mentor");
        const consultations = res.data;
        // Group by slotDate
        const grouped = {};
        consultations.forEach((c) => {
          const date = c.slot.slotDate;
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(c);
        });
        // Convert to array of days
        const days = Object.entries(grouped).map(([date, consults]) => {
          const slots = [0, 1, 2, 3].map((slotIdx) => {
            const found = consults.find((c) => c.slot.slotNumber === slotIdx);
            if (found) {
              return {
                time: slotTimeFromNumber(slotIdx),
                isAvailable: false,
                clientName: found.user.fullName,
                clientId: found.user.userId,
                consultationId: found.consultationId,
                meetingLink: found.meetingLink,
                status: found.status,
                slotDate: date,
              };
            } else {
              return {
                time: slotTimeFromNumber(slotIdx),
                isAvailable: true,
                statusText: "Available slot",
                slotDate: date,
              };
            }
          });
          return {
            date,
            bookedSlots: consults.length,
            totalSlots: 4,
            timeSlots: slots,
          };
        });
        days.sort((a, b) => new Date(a.date) - new Date(b.date));
        setScheduleData(days);
      } catch {
        setError("Failed to fetch overview data");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  // Helper: slot number to time string
  function slotTimeFromNumber(slotNumber) {
    const slotTimes = ["09:00", "10:00", "11:00", "14:00"];
    return slotTimes[slotNumber] || "";
  }

  // Tổng số ngày có lịch
  const totalDays = scheduleData.length;
  // Tổng số slot đã đặt
  const totalBookedSlots = scheduleData.reduce(
    (sum, day) => sum + day.bookedSlots,
    0
  );
  // Tổng số slot trống
  const totalAvailableSlots = scheduleData.reduce(
    (sum, day) => sum + day.timeSlots.filter((s) => s.isAvailable).length,
    0
  );
  // Số lượng khách hàng duy nhất
  const uniqueClients = new Set();
  scheduleData.forEach((day) => {
    day.timeSlots.forEach((slot) => {
      if (!slot.isAvailable && slot.clientId) uniqueClients.add(slot.clientId);
    });
  });
  const totalClients = uniqueClients.size;

  // Lấy danh sách slot hôm nay
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySchedule = scheduleData.find((day) => day.date === todayStr);
  const todaySlots = todaySchedule ? todaySchedule.timeSlots : [];

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );
  if (error)
    return (
      <Alert type="error" message={error} showIcon style={{ margin: 24 }} />
    );

  return (
    <>
      <Card
        className={styles.dashboardUpcomingAppointmentsCard}
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
          border: "none",
          marginBottom: 24,
          borderRadius: 16,
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onClick={() => navigate("/mentor/appointments")}
        hoverable
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <CalendarOutlined
            style={{ fontSize: 24, color: "#fff", marginRight: 12 }}
          />
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            Today's Appointments
          </Title>
        </div>
        <div
          style={{ display: "flex", alignItems: "baseline", margin: "16px 0" }}
        >
          <Title level={1} style={{ color: "#fff", fontSize: 48, margin: 0 }}>
            {todaySlots.filter((s) => !s.isAvailable).length}
          </Title>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 20,
              marginLeft: 8,
            }}
          >
            slots booked today
          </Text>
        </div>
        <Paragraph
          style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 18, margin: 0 }}
        >
          Click to manage appointments{" "}
          <span style={{ marginLeft: 4, fontSize: 20 }}>→</span>
        </Paragraph>
      </Card>

      <Card title="Today's Appointment Details" style={{ marginBottom: 24 }}>
        {todaySlots.length === 0 ? (
          <Empty
            description={<span>No appointments scheduled for today</span>}
          />
        ) : (
          <List
            dataSource={todaySlots}
            renderItem={(slot) => (
              <List.Item>
                <Space>
                  <Tag color={slot.isAvailable ? "#d9d9d9" : "#0d9488"}>
                    {slot.time}
                  </Tag>
                  {slot.isAvailable ? (
                    <Text type="secondary">Available</Text>
                  ) : (
                    <>
                      <Text strong>{slot.clientName}</Text>
                      <Text type="secondary">({slot.status})</Text>
                    </>
                  )}
                </Space>
              </List.Item>
            )}
          />
        )}
      </Card>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Days with Appointments"
              value={totalDays}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Booked Slots" value={totalBookedSlots} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Available Slots" value={totalAvailableSlots} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Unique Clients" value={totalClients} />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default MentorOverview;
