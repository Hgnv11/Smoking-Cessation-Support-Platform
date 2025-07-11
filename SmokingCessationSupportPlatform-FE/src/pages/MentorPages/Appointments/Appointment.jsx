import React, { useEffect, useState } from "react";
import { Card, Button, Typography, Space, Row, Col, Spin, Alert, Modal, Avatar, Divider, Rate } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined, StarOutlined } from "@ant-design/icons";
import styles from "./Appointment.module.css";
import api from "../../../config/axios";
import { coachService } from "../../../services/coachService"; // <-- import mới

const { Title, Text } = Typography;

export const Appointment = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [smokingProgress, setSmokingProgress] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi api để lấy danh sách consultations
        const consultations = await coachService.getMentorConsultations();
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

  // Fetch consultation details for modal (cập nhật để lấy cả progress)
  const fetchConsultationDetails = async (consultationId, userId) => {
    setModalLoading(true);
    try {
      const [consultationRes, progressRes] = await Promise.all([
        api.get(`/mentor-dashboard/consultations/${consultationId}`),
        coachService.getUserSmokingProgress(userId),
      ]);
      setSelectedConsultation(consultationRes.data);
      setSmokingProgress(progressRes[0] || null); // response là array
      setModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch consultation details:", error);
      Alert.error("Failed to load consultation details");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle click on client name (truyền thêm userId)
  const handleClientNameClick = (consultationId, userId) => {
    fetchConsultationDetails(consultationId, userId);
  };

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
                <Typography.Link
                  onClick={() => handleClientNameClick(slot.consultationId, slot.clientId)}
                  className={styles.clientNameLink}
                >
                  {slot.clientName || "Unknown Client"}
                </Typography.Link>
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

      {/* Consultation Details Modal */}
      <Modal
        title="Consultation Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          selectedConsultation?.meetingLink && (
            <Button
              key="start"
              type="primary"
              onClick={() => {
                window.open(selectedConsultation.meetingLink, "_blank");
                setModalVisible(false);
              }}
            >
              Start Consultation
            </Button>
          ),
        ]}
        width={600}
        loading={modalLoading}
      >
        {selectedConsultation && (
          <div>
            {/* Client Information */}
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>
                <UserOutlined style={{ marginRight: 8 }} />
                Client Information
              </Title>
              <Space align="start" size={16}>
                <Avatar
                  size={64}
                  src={selectedConsultation.user?.avatarUrl}
                  icon={<UserOutlined />}
                />
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    {selectedConsultation.user?.fullName}
                  </Text>
                  <br />
                  <Text type="secondary">
                    {selectedConsultation.user?.email}
                  </Text>
                  <br />
                  <Text type="secondary">
                    Gender: {selectedConsultation.user?.gender || "N/A"}
                  </Text>
                  {selectedConsultation.user?.birthDate && (
                    <>
                      <br />
                      <Text type="secondary">
                        Birth Date: {new Date(selectedConsultation.user.birthDate).toLocaleDateString()}
                      </Text>
                    </>
                  )}
                </div>
              </Space>
            </div>

            <Divider />

            {/* Consultation Information */}
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>
                <CalendarOutlined style={{ marginRight: 8 }} />
                Consultation Information
              </Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>Date: </Text>
                  <Text>{selectedConsultation.slot?.slotDate}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Time: </Text>
                  <Text>{slotTimeFromNumber(selectedConsultation.slot?.slotNumber)}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Status: </Text>
                  <Text>{selectedConsultation.status}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Created: </Text>
                  <Text>{new Date(selectedConsultation.createdAt).toLocaleDateString()}</Text>
                </Col>
              </Row>
            </div>

            {/* Rating and Feedback */}
            {(selectedConsultation.rating > 0 || selectedConsultation.feedback) && (
              <>
                <Divider />
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>
                    <StarOutlined style={{ marginRight: 8 }} />
                    Rating & Feedback
                  </Title>
                  {selectedConsultation.rating > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Rating: </Text>
                      <Rate disabled defaultValue={selectedConsultation.rating} />
                      <Text style={{ marginLeft: 8 }}>
                        ({selectedConsultation.rating}/5)
                      </Text>
                    </div>
                  )}
                  {selectedConsultation.feedback && (
                    <div>
                      <Text strong>Feedback: </Text>
                      <br />
                      <Text>{selectedConsultation.feedback}</Text>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Notes */}
            {selectedConsultation.notes && (
              <>
                <Divider />
                <div>
                  <Title level={5}>Notes</Title>
                  <Text>{selectedConsultation.notes}</Text>
                </div>
              </>
            )}

            {/* Smoking Cessation Progress */}
            {smokingProgress && (
              <>
                <Divider />
                <Title level={5}>Smoking Cessation Progress</Title>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>Cigarettes/day: </Text>
                    <Text>{smokingProgress.cigarettesPerDay}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Money saved: </Text>
                    <Text>{smokingProgress.moneySaved} đ</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Cigarettes avoided: </Text>
                    <Text>{smokingProgress.cigarettesAvoided}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Avg. craving level: </Text>
                    <Text>{smokingProgress.averageCravingLevel}</Text>
                  </Col>
                </Row>
                <Divider />
                <Title level={5}>Recent Smoking History</Title>
                {smokingProgress.smokingHistoryByDate &&
                  Object.entries(smokingProgress.smokingHistoryByDate)
                    .slice(-3)
                    .map(([date, events]) => (
                      <div key={date} style={{ marginBottom: 8 }}>
                        <Text strong>{date}:</Text>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {events.map((event) => (
                            <li key={event.eventId}>
                              <Text>
                                {event.cigarettesSmoked} cigarettes, craving: {event.cravingLevel} /10
                                {event.notes && <> – <i>{event.notes}</i></>}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Appointment;
