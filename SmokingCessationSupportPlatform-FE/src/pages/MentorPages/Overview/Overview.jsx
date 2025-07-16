import styles from "./Overview.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Card, Typography, Row, Col, Statistic, Button, List, Tag, Empty, Spin, Alert } from "antd";
import api from "../../../config/axios";
import { coachService } from "../../../services/coachService";
import AppointmentSVG from "./AppointmentSVG"; // SVG minh họa custom

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
    <div className={styles.overviewPage}>
      <Title level={1} className={styles.pageTitle}>Overview</Title>

      {/* Stat Cards */}
      <Row gutter={24} className={styles.statCardsRow}>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statCardIconBg}>
              <CalendarOutlined className={styles.statCardIcon} />
            </div>
            <div>
              <div className={styles.statCardLabel}>Days with Appointments</div>
              <div className={styles.statCardValueTeal}>
                {overviewStats?.totalAppointmentDays ?? 0}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statCardIconBg}>
              <CheckCircleOutlined className={styles.statCardIcon} />
            </div>
            <div>
              <div className={styles.statCardLabel}>Booked Slots</div>
              <div className={styles.statCardValueBlue}>
                {overviewStats?.totalBookedSlots ?? 0}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statCardIconBg}>
              <ClockCircleOutlined className={styles.statCardIcon} />
            </div>
            <div>
              <div className={styles.statCardLabel}>Available Slots</div>
              <div className={styles.statCardValueGray}>
                {overviewStats?.availableSlots ?? 0}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statCardIconBg}>
              <TeamOutlined className={styles.statCardIcon} />
            </div>
            <div>
              <div className={styles.statCardLabel}>Unique Clients</div>
              <div className={styles.statCardValueTeal}>
                {overviewStats?.uniqueClients ?? 0}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Today's Appointments */}
      <Card className={styles.todayCard}>
        <div className={styles.todayHeader}>
          <Title level={3} className={styles.todayTitle}>Today's Appointments</Title>
        </div>
        {todaySlots.length === 0 ? (
          <div className={styles.emptyState}>
            <AppointmentSVG className={styles.emptySVG} />
            <Text className={styles.emptyText}>No appointments scheduled for today</Text>
            <Button
              type="primary"
              className={styles.ctaButton}
              onClick={() => navigate("/mentor/appointments")}
            >
              Schedule Appointment
            </Button>
          </div>
        ) : (
          <List
            dataSource={todaySlots}
            renderItem={(slot) => (
              <List.Item>
                <Text strong className={styles.slotTime}>{slot.time}</Text>
                <Text className={styles.slotClient}>
                  {slot.isAvailable ? (
                    <span className={styles.slotAvailable}>Available</span>
                  ) : (
                    <>
                      {slot.clientName}
                      <span className={styles.slotStatus}> ({slot.status})</span>
                    </>
                  )}
                </Text>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};
export default MentorOverview;
