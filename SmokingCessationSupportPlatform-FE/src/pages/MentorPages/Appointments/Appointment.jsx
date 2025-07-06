import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography, Space, Row, Col, Spin, Alert } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import styles from "./Appointment.module.css";
import api from "../../../config/axios";

const { Title, Text } = Typography;

export const MentorAppointment = () => {
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/consultations/mentor/16/slots");
        // Transform response to group by slotDate
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
          // There are max 4 slots per day, slotNumber: 0-3 or 1-4
          // Build slots array for UI
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
              };
            } else {
              return {
                time: slotTimeFromNumber(slotIdx),
                isAvailable: true,
                statusText: "Available slot",
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
        // Sort by date ascending
        days.sort((a, b) => new Date(a.date) - new Date(b.date));
        setScheduleData(days);
      } catch {
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  // Helper: slot number to time string
  function slotTimeFromNumber(slotNumber) {
    // Example: 0: 09:00, 1: 10:00, 2: 11:00, 3: 14:00
    const slotTimes = ["09:00", "10:00", "11:00", "14:00"];
    return slotTimes[slotNumber] || "";
  }

  const handleStartConsultation = (clientName, time, meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, "_blank");
    } else {
      // fallback: show message or modal
      alert(`No meeting link for this consultation.`);
    }
  };

  const renderTimeSlotCard = (slot) => {
    const isAvailable = slot.isAvailable;
    return (
      <Card
        className={
          isAvailable ? styles.slotAvailableCard : styles.slotBookedCard
        }
        styles={{ body: { padding: 0 } }}
      >
        <div className={styles.slotCardContent}>
          <Title level={4} className={styles.slotTimeText}>
            {slot.time}
          </Title>
          {isAvailable ? (
            <>
              <ClockCircleOutlined className={styles.slotIconAvailable} />
              <Text className={styles.slotStatusAvailable}>
                {slot.statusText}
              </Text>
            </>
          ) : (
            <>
              <CheckCircleOutlined className={styles.slotIconBooked} />
              <Text className={styles.slotStatusBooked}>
                Booked by{" "}
                {slot.clientId && slot.clientName ? (
                  <Typography.Link
                    onClick={() => navigate(`/mentor/clients/${slot.clientId}`)}
                    className={styles.clientNameLink}
                  >
                    {slot.clientName}
                  </Typography.Link>
                ) : (
                  slot.clientName || "Unknown Client"
                )}
              </Text>
              <Button
                type="primary"
                size="small"
                className={styles.startConsultationButton}
                onClick={() =>
                  handleStartConsultation(
                    slot.clientName,
                    slot.time,
                    slot.meetingLink
                  )
                }
              >
                Start Consultation
              </Button>
            </>
          )}
        </div>
      </Card>
    );
  };

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
      <div className={styles.workScheduleSection}>
        <Title level={3} className={styles.workScheduleTitle}>
          Work Schedule
        </Title>
        <Text type="secondary" className={styles.workScheduleDescription}>
          Appointments are booked by Premium clients and automatically confirmed
          by the system. Each day has a maximum of 4 consultation slots.
        </Text>
      </div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {scheduleData.map((daySchedule, index) => (
          <div key={index} className={styles.dayScheduleContainer}>
            <div className={styles.dayHeader}>
              <Title level={4} className={styles.dayDate}>
                {daySchedule.date}
              </Title>
              <Text className={styles.daySlotCount}>
                {daySchedule.bookedSlots}/{daySchedule.totalSlots} slots booked
              </Text>
            </div>
            <Row gutter={[16, 16]} className={styles.timeSlotsRow}>
              {daySchedule.timeSlots.map((slot, slotIndex) => (
                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  key={slotIndex}
                  className={styles.timeSlotCol}
                >
                  {renderTimeSlotCard(slot)}
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Space>
    </>
  );
};

export default MentorAppointment;
