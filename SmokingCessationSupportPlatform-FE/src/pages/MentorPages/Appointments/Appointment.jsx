import React, { useEffect, useState, useRef } from "react";
import {
  Card, Button, Typography, Space, Row, Col, Spin, Alert, Modal, Avatar, Tabs, Tag
} from "antd";
import {
  ClockCircleOutlined, CheckCircleOutlined, UserOutlined, DollarOutlined, FireOutlined
} from "@ant-design/icons";
import styles from "./Appointment.module.css";
import api from "../../../config/axios";
import { coachService } from "../../../services/coachService";

const { Title, Text } = Typography;

export const Appointment = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [smokingProgress, setSmokingProgress] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const consultations = await coachService.getMentorConsultations();
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

  function slotTimeFromNumber(slotNumber) {
    const slotTimes = ["09:00", "10:00", "11:00", "14:00"];
    return slotTimes[slotNumber] || "";
  }

  // Fetch consultation details for modal
  const fetchConsultationDetails = async (consultationId, userId) => {
    setModalLoading(true);
    try {
      const [consultationRes, progressRes] = await Promise.all([
        api.get(`/mentor-dashboard/consultations/${consultationId}`),
        coachService.getUserSmokingProgress(userId),
      ]);
      setSelectedConsultation(consultationRes.data);
      setSmokingProgress(progressRes[0] || progressRes || null); // handle array or object
      setModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch consultation details:", error);
      Alert.error("Failed to load consultation details");
    } finally {
      setModalLoading(false);
    }
  };

  const handleClientNameClick = (consultationId, userId) => {
    fetchConsultationDetails(consultationId, userId);
  };

  const handleStartConsultation = (clientName, time, meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, "_blank");
    } else {
      alert(`No meeting link for this consultation.`);
    }
  };

  const handleSaveNote = async () => {
    if (!note.trim() || !selectedConsultation) return;
    setSaving(true);
    try {
      await coachService.addConsultationNote(selectedConsultation.consultationId, note);
      setNotes([{ content: note, time: new Date().toLocaleString() }, ...notes]);
      setNote("");
    } finally {
      setSaving(false);
    }
  };

  const renderTimeSlotCard = (slot) => {
    const isAvailable = slot.isAvailable;
    return (
      <Card
        className={isAvailable ? styles.slotAvailableCard : styles.slotBookedCard}
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
        footer={null}
        width={900}
        className={styles.consultModal}
        bodyStyle={{ padding: 0, background: "#fff", borderRadius: 20 }}
        confirmLoading={modalLoading}
      >
        {selectedConsultation && (
          <div className={styles.consultModalWrapper}>
            {/* Left Column: Client Snapshot */}
            <div className={styles.consultModalSidebar}>
              <Avatar
                size={80}
                src={selectedConsultation.user?.avatarUrl}
                icon={<UserOutlined />}
                className={styles.consultModalAvatar}
              />
              <div className={styles.consultModalName}>{selectedConsultation.user?.fullName}</div>
              <div className={styles.consultModalEmail}>{selectedConsultation.user?.email}</div>
              <div className={styles.statCardsGrid}>
                <div className={styles.statCard}>
                  <DollarOutlined className={styles.statCardIconTeal} />
                  <div className={styles.statCardValue}>{smokingProgress?.moneySaved ?? "--"}</div>
                  <div className={styles.statCardLabel}>Money Saved</div>
                </div>
                <div className={styles.statCard}>
                  <FireOutlined className={styles.statCardIconRed} />
                  <div className={styles.statCardValue}>{smokingProgress?.cigarettesAvoided ?? "--"}</div>
                  <div className={styles.statCardLabel}>Cigarettes Avoided</div>
                </div>
                <div className={styles.statCard}>
                  <CheckCircleOutlined className={styles.statCardIconGreen} />
                  <div className={styles.statCardValue}>{smokingProgress?.cigarettesPerDay ?? "--"}</div>
                  <div className={styles.statCardLabel}>Cigarettes/Day</div>
                </div>
                <div className={styles.statCard}>
                  <ClockCircleOutlined className={styles.statCardIconYellow} />
                  <div className={styles.statCardValue}>{smokingProgress?.averageCravingLevel ?? "--"}</div>
                  <div className={styles.statCardLabel}>Avg. Craving</div>
                </div>
              </div>
            </div>
            {/* Right Column: Tabs */}
            <div className={styles.consultModalMain}>
              <Tabs defaultActiveKey="1" className={styles.consultTabs}>
                <Tabs.TabPane tab="Consultation Info" key="1">
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Date:</span>
                    <span>{selectedConsultation.slot?.slotDate}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Time:</span>
                    <span>{slotTimeFromNumber(selectedConsultation.slot?.slotNumber)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Status:</span>
                    <span>
                      <Tag color="success" style={{ borderRadius: 8, fontWeight: 500 }}>
                        {selectedConsultation.status}
                      </Tag>
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Created:</span>
                    <span>{new Date(selectedConsultation.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Gender:</span>
                    <span>{selectedConsultation.user?.gender || "N/A"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Birth Date:</span>
                    <span>
                      {selectedConsultation.user?.birthDate
                        ? new Date(selectedConsultation.user.birthDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Smoking History" key="2">
                  <div className={styles.timelineTitle}>Recent Smoking History</div>
                  <div className={styles.verticalTimeline}>
                    {(smokingProgress?.smokingHistoryByDate
                      ? Object.entries(smokingProgress.smokingHistoryByDate).slice(-5)
                      : []
                    ).map(([date, events], idx) =>
                      events.map((event, eidx) => (
                        <div className={styles.timelineItem} key={event.eventId || `${date}-${eidx}`}>
                          <div className={styles.timelineDot} />
                          <div className={styles.timelineContent}>
                            <div className={styles.timelineDate}>
                              {new Date(date).toLocaleDateString()}
                            </div>
                            <div className={styles.timelineDetails}>
                              <span className={styles.timelineCigarettes}>
                                {event.cigarettesSmoked} cigarettes
                              </span>
                              <Tag
                                className={styles.timelineCravingTag}
                                style={{
                                  background:
                                    event.cravingLevel >= 7
                                      ? "#fee2e2"
                                      : event.cravingLevel >= 4
                                      ? "#fef9c3"
                                      : "#dcfce7",
                                  color:
                                    event.cravingLevel >= 7
                                      ? "#dc2626"
                                      : event.cravingLevel >= 4
                                      ? "#d97706"
                                      : "#16a34a",
                                  border: "none",
                                  fontWeight: 600,
                                  borderRadius: 8,
                                }}
                              >
                                Craving: {event.cravingLevel}/10
                              </Tag>
                              {event.notes && (
                                <span className={styles.timelineNote}>
                                  – <i>{event.notes}</i>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {(!smokingProgress?.smokingHistoryByDate ||
                      Object.keys(smokingProgress.smokingHistoryByDate).length === 0) && (
                      <div className={styles.timelineEmpty}>No history available.</div>
                    )}
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Notes" key="99">
                  <div style={{ background: "#fff", borderRadius: 12, padding: 18 }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Add Note</div>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      rows={4}
                      style={{
                        width: "100%",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        padding: 10,
                        fontSize: 15,
                        marginBottom: 12,
                        resize: "vertical"
                      }}
                      placeholder="Enter your note here..."
                    />
                    <Button
                      type="primary"
                      loading={saving}
                      onClick={handleSaveNote}
                      style={{ background: "#0d9488", border: "none", borderRadius: 8 }}
                    >
                      Save
                    </Button>
                    <div style={{ marginTop: 24 }}>
                      {notes.length > 0 && <div style={{ fontWeight: 600, marginBottom: 8 }}>Saved Notes</div>}
                      {notes.map((n, i) => (
                        <div key={i} style={{
                          background: "#f8fafc",
                          borderRadius: 8,
                          padding: 10,
                          marginBottom: 10,
                          fontSize: 15
                        }}>
                          <div style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>{n.time}</div>
                          <div>{n.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tabs.TabPane>
              </Tabs>
              <div style={{ textAlign: "right", marginTop: 24 }}>
                <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
                  Close
                </Button>
                {selectedConsultation?.meetingLink && (
                  <Button
                    type="primary"
                    onClick={() => {
                      window.open(selectedConsultation.meetingLink, "_blank");
                      setModalVisible(false);
                    }}
                    style={{ background: "#0d9488", borderColor: "#0d9488", borderRadius: 8 }}
                  >
                    Start Consultation
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Appointment;
