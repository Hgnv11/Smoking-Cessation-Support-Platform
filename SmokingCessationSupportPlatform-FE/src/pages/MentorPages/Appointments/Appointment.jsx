import React from "react";
import { useNavigate } from "react-router-dom"; // Thêm import này
import {
  Card,
  Button,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "./Appointment.module.css";
import { scheduleData } from "../../../services/scheduleDataOverviewCoach"; // Import centralized data

const { Title, Text } = Typography; // Typography đã được import

export const Appointment = () => {
  const navigate = useNavigate(); // Khởi tạo hook navigate

  const handleStartConsultation = (clientName, time) => {
    console.log(`Starting consultation with ${clientName} at ${time}`);
    // Add actual logic here, e.g., navigate to a consultation page or open a modal
  };

  const renderTimeSlotCard = (slot) => {
    const isAvailable = slot.isAvailable;

    return (
      <Card
        className={isAvailable ? styles.slotAvailableCard : styles.slotBookedCard}
        styles={{ body: { padding: 0 } }} // Updated from bodyStyle to styles.body
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
                Booked by{' '}
                {slot.clientId && slot.clientName ? (
                  <Typography.Link 
                    onClick={() => navigate(`/mentor/clients/${slot.clientId}`)}
                    className={styles.clientNameLink}
                  >
                    {slot.clientName}
                  </Typography.Link>
                ) : (
                  // Fallback if clientId or clientName is missing for some reason
                  slot.clientName || 'Unknown Client'
                )}
              </Text>
              <Button
                type="primary"
                size="small"
                className={styles.startConsultationButton}
                onClick={() => handleStartConsultation(slot.clientName, slot.time)}
              >
                Start Consultation
              </Button>
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <>
      <div className={styles.workScheduleSection}>
        <Title level={3} className={styles.workScheduleTitle}>
          Work Schedule
        </Title>
        <Text type="secondary" className={styles.workScheduleDescription}>
          Appointments are booked by Premium clients and automatically confirmed by the system. Each day has a maximum of 4 consultation slots.
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
                <Col xs={24} sm={12} md={12} lg={6} key={slotIndex} className={styles.timeSlotCol}>
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

export default Appointment;

