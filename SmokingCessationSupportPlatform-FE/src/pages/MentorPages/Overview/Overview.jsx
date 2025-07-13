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
import { coachService } from "../../../services/coachService";

const { Title, Text, Paragraph } = Typography;

export const MentorOverview = () => {
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Sử dụng Promise.all để gọi các API song song
        const [overviewRes, consultationsRes] = await Promise.all([
          coachService.getDashboardOverview(),
          api.get("/consultations/mentor"),
        ]);

        setOverviewStats(overviewRes);

        // Xử lý dữ liệu lịch hẹn chi tiết (giữ nguyên logic cũ)
        const consultations = consultationsRes.data;
        const grouped = {};
        consultations.forEach((c) => {
          const date = c.slot.slotDate;
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(c);
        });
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
      } catch (err) {
        setError("Failed to fetch overview data. Please try again later.");
        // Trong trường hợp lỗi, bạn có thể muốn đặt dữ liệu mock để UI không bị trống
        // setScheduleData(mockScheduleData); 
        // setOverviewStats({ todayBookedSlots: 2, totalAppointmentDays: 2, totalBookedSlots: 3, availableSlots: 5, uniqueClients: 3 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <Spin size="large" className={styles.loader} />
    );
  if (error)
    return (
      <Alert type="error" message={error} showIcon className={styles.errorAlert} />
    );

  return (
    <>
      <Card
        className={styles.dashboardUpcomingAppointmentsCard}
        onClick={() => navigate("/mentor/appointments")}
        hoverable
      >
        <div className={styles.cardHeader}>
          <CalendarOutlined className={styles.cardIcon} />
          <Title level={2} className={styles.cardTitle}>
            Appointments Overview
          </Title>
        </div>
        <div className={styles.statsContainer}>
          <Title level={1} className={styles.mainStat}>
            {overviewStats?.totalAppointmentDays ?? 0}
          </Title>
          <Text className={styles.mainStatLabel}>
            days with appointments
          </Text>
        </div>
        <Paragraph className={styles.cardDescription}>
          Click to manage appointments{" "}
          <span className={styles.cardActionArrow}>→</span>
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
              value={overviewStats?.totalAppointmentDays ?? 0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Booked Slots" value={overviewStats?.totalBookedSlots ?? 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Available Slots" value={overviewStats?.availableSlots ?? 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Unique Clients" value={overviewStats?.uniqueClients ?? 0} />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default MentorOverview;
