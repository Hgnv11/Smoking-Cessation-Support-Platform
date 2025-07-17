import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Spin,
  Alert,
  Modal,
  Avatar,
  Divider,
  Rate,
  Input,
  Select,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  StarOutlined,
  VideoCameraOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import styles from "./Appointment.module.css";
import api from "../../../config/axios";
import { coachService } from "../../../services/coachService";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const Appointment = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [smokingProgress, setSmokingProgress] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // New state for consultation management
  const [consultationModalVisible, setConsultationModalVisible] =
    useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [consultationStatus, setConsultationStatus] = useState("scheduled");
  const [consultationNotes, setConsultationNotes] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [updatingConsultation, setUpdatingConsultation] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const [allSlots, consultations] = await Promise.all([
          coachService.getAllMentorConsultations(),
          coachService.getMentorConsultations(),
        ]);

        const today = new Date();
        const todayStr = formatDateToString(today);

        const futureSlots = allSlots.filter((slot) => {
          return slot.slotDate >= todayStr;
        });

        const consultationMap = {};
        consultations.forEach((consultation) => {
          const key = `${consultation.slot.slotDate}-${consultation.slot.slotNumber}`;
          consultationMap[key] = consultation;
        });

        const grouped = {};
        futureSlots.forEach((slot) => {
          const date = slot.slotDate;
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(slot);
        });

        const days = Object.entries(grouped).map(([date, slots]) => {
          const timeSlots = slots.map((slot) => {
            const consultationKey = `${slot.slotDate}-${slot.slotNumber}`;
            const consultation = consultationMap[consultationKey];

            if (slot.booked && consultation) {
              return {
                time: getSlotTimeRange(slot.slotNumber),
                isAvailable: false,
                clientName: consultation.user.fullName,
                clientId: consultation.user.userId,
                consultationId: consultation.consultationId,
                meetingLink: consultation.meetingLink,
                status: consultation.status,
                slotId: slot.slotId,
              };
            } else if (slot.booked) {
              return {
                time: getSlotTimeRange(slot.slotNumber),
                isAvailable: false,
                clientName: "Booked by User",
                clientId: null,
                consultationId: null,
                meetingLink: null,
                status: "booked",
                slotId: slot.slotId,
              };
            } else {
              return {
                time: getSlotTimeRange(slot.slotNumber),
                isAvailable: true,
                statusText: "Available slot",
                slotId: slot.slotId,
              };
            }
          });

          timeSlots.sort((a, b) => {
            const aSlotNum =
              slots.find((s) => s.slotId === a.slotId)?.slotNumber || 0;
            const bSlotNum =
              slots.find((s) => s.slotId === b.slotId)?.slotNumber || 0;
            return aSlotNum - bSlotNum;
          });

          return {
            date,
            bookedSlots: slots.filter((s) => s.booked).length,
            totalSlots: slots.length,
            timeSlots: timeSlots,
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

  // Helper functions
  function slotTimeFromNumber(slotNumber) {
    const slotTimes = ["09:00", "10:00", "11:00", "14:00"];
    return slotTimes[slotNumber] || "";
  }

  const getSlotTimeRange = (slotNumber) => {
    const timeRanges = {
      1: "7:00 AM - 9:30 AM",
      2: "9:30 AM - 12:00 PM",
      3: "13:00 PM - 15:30 PM",
      4: "15:30 PM - 18:00 PM",
    };
    return timeRanges[slotNumber] || "";
  };

  const formatDateToString = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Fetch consultation details for modal
  const fetchConsultationDetails = async (consultationId, userId) => {
    setModalLoading(true);
    try {
      const [consultationRes, progressRes] = await Promise.all([
        api.get(`/mentor-dashboard/consultations/${consultationId}`),
        coachService.getUserSmokingProgress(userId),
      ]);
      setSelectedConsultation(consultationRes.data);
      setSmokingProgress(progressRes[0] || null);
      setModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch consultation details:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleClientNameClick = (consultationId, userId) => {
    if (consultationId && userId) {
      fetchConsultationDetails(consultationId, userId);
    }
  };

  // New function to handle starting consultation
  const handleStartConsultation = (slot) => {
    setSelectedSlot(slot);
    setConsultationStatus(slot.status || "scheduled");
    setConsultationNotes("");
    setMeetingLink("");
    setConsultationModalVisible(true);
  };

  // Function to create Google Meet room
  const createMeetingRoom = async () => {
    setCreatingRoom(true);
    try {
      const response = await api.post("test-daily/create-room");
      console.log("Meeting room response:", response.data);

      // Handle different possible response formats
      const meetingUrl =
        response.data.url ||
        response.data.meetingLink ||
        response.data.roomUrl ||
        response.data ||
        "";

      setMeetingLink(meetingUrl);

      if (meetingUrl) {
        Modal.success({
          title: "Success",
          content: "Meeting room created successfully!",
        });
      }
    } catch (error) {
      console.error("Failed to create meeting room:", error);
      Modal.error({
        title: "Error",
        content: "Failed to create meeting room. Please try again.",
      });
    } finally {
      setCreatingRoom(false);
    }
  };

  // Function to update consultation status and notes
  const updateConsultationStatus = async () => {
    if (!selectedSlot?.consultationId) {
      Modal.error({
        title: "Error",
        content: "No consultation selected or consultation ID missing.",
      });
      return;
    }

    if (!consultationStatus) {
      Modal.error({
        title: "Error",
        content: "Please select a status before updating.",
      });
      return;
    }

    setUpdatingConsultation(true);
    try {
      // Map frontend status values to backend enum values
      const statusMapping = {
        scheduled: "scheduled",
        completed: "completed",
        cancelled: "cancelled",
      };

      const backendStatus =
        statusMapping[consultationStatus] ||
        consultationStatus.toUpperCase().replace("-", "_");

      // Prepare the request data with proper status formatting
      const requestData = {
        status: backendStatus,
        ...(consultationNotes.trim() && { notes: consultationNotes.trim() }),
      };

      console.log("Updating consultation with data:", requestData);
      console.log("Frontend status:", consultationStatus);
      console.log("Backend status:", backendStatus);
      console.log("Consultation ID:", selectedSlot.consultationId);

      // Try the request with status in body first
      try {
        await api.patch(
          `/consultations/${selectedSlot.consultationId}/status-note`,
          requestData
        );
      } catch (firstError) {
        // If that fails, try with status as query parameter
        console.log(
          "First attempt failed, trying with query parameters...",
          firstError.message
        );
        const params = new URLSearchParams();
        params.append("status", backendStatus);
        if (consultationNotes.trim()) {
          params.append("notes", consultationNotes.trim());
        }

        await api.patch(
          `/consultations/${
            selectedSlot.consultationId
          }/status-note?${params.toString()}`
        );
      }

      Modal.success({
        title: "Success",
        content: "Consultation updated successfully!",
      });

      setConsultationModalVisible(false);

      // Refresh the schedule data
      window.location.reload();
    } catch (error) {
      console.error("Failed to update consultation:", error);
      console.error("Error response:", error.response?.data);
      Modal.error({
        title: "Error",
        content:
          error.response?.data?.message ||
          "Failed to update consultation. Please try again.",
      });
    } finally {
      setUpdatingConsultation(false);
    }
  };

  // Function to open meeting link in new tab
  const openMeetingLink = (meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, "_blank");
    } else {
      Modal.warning({
        title: "No Meeting Link",
        content: "No meeting link available for this consultation.",
      });
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
                {slot.consultationId && slot.clientId ? (
                  <Typography.Link
                    onClick={() =>
                      handleClientNameClick(slot.consultationId, slot.clientId)
                    }
                    className={styles.clientNameLink}
                  >
                    {slot.clientName || "Unknown Client"}
                  </Typography.Link>
                ) : (
                  <span>{slot.clientName || "Unknown Client"}</span>
                )}
              </Text>

              {/* Show different content based on consultation status */}
              {slot.status === "completed" ? (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    backgroundColor: "#f6ffed",
                    border: "1px solid #d9f7be",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#52c41a",
                      fontWeight: "500",
                      fontSize: "12px",
                    }}
                  >
                    ✓ Completed
                  </Text>
                </div>
              ) : (
                <Button
                  type="primary"
                  size="small"
                  icon={<VideoCameraOutlined />}
                  className={styles.startConsultationButton}
                  onClick={() => handleStartConsultation(slot)}
                  style={{ marginTop: "8px" }}
                >
                  Start Consultation
                </Button>
              )}
            </>
          )}
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );
  }

  if (error) {
    return (
      <Alert type="error" message={error} showIcon style={{ margin: 24 }} />
    );
  }

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
                {new Date(daySchedule.date).toLocaleDateString("en-GB")}
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

      {/* Consultation Management Modal */}
      <Modal
        title={
          <div
            style={{
              padding: "16px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Title level={4} style={{ margin: 0, color: "#262626" }}>
              <VideoCameraOutlined
                style={{ marginRight: 8, color: "#1890ff" }}
              />
              Start Consultation
            </Title>
          </div>
        }
        open={consultationModalVisible}
        onCancel={() => setConsultationModalVisible(false)}
        width={600}
        footer={[
          <Button
            key="cancel"
            onClick={() => setConsultationModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            loading={updatingConsultation}
            onClick={updateConsultationStatus}
          >
            Update Consultation
          </Button>,
        ]}
      >
        {selectedSlot && (
          <div style={{ padding: "20px 0" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Client and Time Info */}
              <Card size="small" style={{ backgroundColor: "#fafafa" }}>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "12px",
                    fontSize: "16px",
                  }}
                >
                  Consultation Details
                </Text>
                <div style={{ marginBottom: "8px" }}>
                  <Text style={{ color: "#8c8c8c" }}>Client: </Text>
                  <Text strong>{selectedSlot.clientName}</Text>
                </div>
                <div>
                  <Text style={{ color: "#8c8c8c" }}>Time: </Text>
                  <Text strong>{selectedSlot.time}</Text>
                </div>
              </Card>

              {/* Meeting Link Section */}
              <div>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "12px",
                    fontSize: "16px",
                  }}
                >
                  Meeting Room
                </Text>
                <Space style={{ width: "100%", marginBottom: "12px" }}>
                  <Button
                    icon={<LinkOutlined />}
                    loading={creatingRoom}
                    onClick={createMeetingRoom}
                    type="primary"
                  >
                    Create Meeting Room
                  </Button>
                </Space>

                {meetingLink && (
                  <Card
                    size="small"
                    style={{
                      backgroundColor: "#f6ffed",
                      border: "1px solid #d9f7be",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#52c41a",
                      }}
                    >
                      Meeting Link:
                    </Text>
                    <Input.Group compact>
                      <Input
                        value={meetingLink}
                        readOnly
                        style={{ width: "calc(100% - 80px)" }}
                      />
                      <Button
                        type="primary"
                        icon={<LinkOutlined />}
                        onClick={() => openMeetingLink(meetingLink)}
                        style={{ width: "80px" }}
                      >
                        Open
                      </Button>
                    </Input.Group>
                  </Card>
                )}
              </div>

              {/* Status Update Section */}
              <div>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "12px",
                    fontSize: "16px",
                  }}
                >
                  Update Status
                </Text>
                <Select
                  value={consultationStatus}
                  onChange={setConsultationStatus}
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </div>

              {/* Notes Section */}
              <div>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "12px",
                    fontSize: "16px",
                  }}
                >
                  Notes (Optional)
                </Text>
                <TextArea
                  rows={4}
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Add notes about this consultation..."
                />
              </div>
            </Space>
          </div>
        )}
      </Modal>

      {/* Consultation Details Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <CalendarOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            <Text strong style={{ fontSize: "16px" }}>
              Consultation Details
            </Text>
          </div>
        }
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
        width={700}
        loading={modalLoading}
      >
        {selectedConsultation && (
          <div>
            {/* Client Information Card */}
            <Card style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                <Title level={5} style={{ margin: 0 }}>
                  Client Information
                </Title>
              </div>
              <Space align="start" size={16}>
                <Avatar
                  size={64}
                  src={selectedConsultation.user?.avatarUrl}
                  icon={<UserOutlined />}
                />
                <div style={{ flex: 1 }}>
                  <Text
                    strong
                    style={{ fontSize: 16, display: "block", marginBottom: 4 }}
                  >
                    {selectedConsultation.user?.fullName}
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 2,
                      color: "#8c8c8c",
                    }}
                  >
                    {selectedConsultation.user?.email}
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 2,
                      color: "#8c8c8c",
                    }}
                  >
                    Gender: {selectedConsultation.user?.gender || "N/A"}
                  </Text>
                  {selectedConsultation.user?.birthDate && (
                    <Text style={{ display: "block", color: "#8c8c8c" }}>
                      Birth Date:{" "}
                      {new Date(
                        selectedConsultation.user.birthDate
                      ).toLocaleDateString("en-GB")}
                    </Text>
                  )}
                </div>
              </Space>
            </Card>

            {/* Consultation Information Card */}
            <Card style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <CalendarOutlined
                  style={{ marginRight: 8, color: "#1890ff" }}
                />
                <Title level={5} style={{ margin: 0 }}>
                  Consultation Information
                </Title>
              </div>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div
                    style={{
                      padding: "12px",
                      background: "#fafafa",
                      borderRadius: "4px",
                    }}
                  >
                    <Text
                      style={{
                        color: "#8c8c8c",
                        fontSize: "12px",
                        display: "block",
                      }}
                    >
                      DATE
                    </Text>
                    <Text strong>
                      {new Date(
                        selectedConsultation.slot?.slotDate
                      ).toLocaleDateString("en-GB")}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      padding: "12px",
                      background: "#fafafa",
                      borderRadius: "4px",
                    }}
                  >
                    <Text
                      style={{
                        color: "#8c8c8c",
                        fontSize: "12px",
                        display: "block",
                      }}
                    >
                      TIME
                    </Text>
                    <Text strong>
                      {slotTimeFromNumber(
                        selectedConsultation.slot?.slotNumber - 1
                      )}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      padding: "12px",
                      background: "#fafafa",
                      borderRadius: "4px",
                    }}
                  >
                    <Text
                      style={{
                        color: "#8c8c8c",
                        fontSize: "12px",
                        display: "block",
                      }}
                    >
                      STATUS
                    </Text>
                    <Text strong style={{ textTransform: "capitalize" }}>
                      {selectedConsultation.status}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      padding: "12px",
                      background: "#fafafa",
                      borderRadius: "4px",
                    }}
                  >
                    <Text
                      style={{
                        color: "#8c8c8c",
                        fontSize: "12px",
                        display: "block",
                      }}
                    >
                      CREATED
                    </Text>
                    <Text strong>
                      {new Date(
                        selectedConsultation.createdAt
                      ).toLocaleDateString("en-GB")}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Rating and Feedback Card */}
            {(selectedConsultation.rating > 0 ||
              selectedConsultation.feedback) && (
              <Card style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <StarOutlined style={{ marginRight: 8, color: "#faad14" }} />
                  <Title level={5} style={{ margin: 0 }}>
                    Rating & Feedback
                  </Title>
                </div>
                {selectedConsultation.rating > 0 && (
                  <div
                    style={{
                      marginBottom: 16,
                      padding: "12px",
                      background: "#fafafa",
                      borderRadius: "4px",
                    }}
                  >
                    <Text strong style={{ marginRight: 12 }}>
                      Rating:{" "}
                    </Text>
                    <Rate disabled defaultValue={selectedConsultation.rating} />
                    <Text style={{ marginLeft: 8, color: "#faad14" }}>
                      ({selectedConsultation.rating}/5)
                    </Text>
                  </div>
                )}
                {selectedConsultation.feedback && (
                  <div
                    style={{
                      padding: "12px",
                      background: "#fafafa",
                      borderRadius: "4px",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: "#8c8c8c",
                        fontSize: "12px",
                      }}
                    >
                      FEEDBACK
                    </Text>
                    <Text>"{selectedConsultation.feedback}"</Text>
                  </div>
                )}
              </Card>
            )}

            {/* Notes Card */}
            {selectedConsultation.notes && (
              <Card style={{ marginBottom: 20 }}>
                <Title level={5} style={{ margin: 0, marginBottom: 16 }}>
                  Notes
                </Title>
                <div
                  style={{
                    padding: "12px",
                    background: "#fafafa",
                    borderRadius: "4px",
                  }}
                >
                  <Text>{selectedConsultation.notes}</Text>
                </div>
              </Card>
            )}

            {/* Smoking Cessation Progress Card */}
            {smokingProgress && (
              <Card>
                <Title level={5} style={{ margin: 0, marginBottom: 20 }}>
                  Smoking Cessation Progress
                </Title>

                {/* Key Stats Row */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "16px",
                        background: "#fafafa",
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#1890ff",
                          marginBottom: 4,
                        }}
                      >
                        {smokingProgress.daysSinceStart}
                      </div>
                      <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        DAYS SMOKE-FREE
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "16px",
                        background: "#fafafa",
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#52c41a",
                          marginBottom: 4,
                        }}
                      >
                        {smokingProgress.moneySaved}
                      </div>
                      <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        MONEY SAVED
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "16px",
                        background: "#fafafa",
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#722ed1",
                          marginBottom: 4,
                        }}
                      >
                        {smokingProgress.cigarettesAvoided}
                      </div>
                      <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        CIGARETTES AVOIDED
                      </Text>
                    </div>
                  </Col>
                </Row>

                {/* Detailed Info Grid */}
                <Row gutter={[16, 12]}>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px",
                        background: "#fafafa",
                        borderRadius: "4px",
                      }}
                    >
                      <Text
                        style={{
                          color: "#8c8c8c",
                          fontSize: "12px",
                          display: "block",
                        }}
                      >
                        START DATE
                      </Text>
                      <Text strong>
                        {new Date(smokingProgress.startDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px",
                        background: "#fafafa",
                        borderRadius: "4px",
                      }}
                    >
                      <Text
                        style={{
                          color: "#8c8c8c",
                          fontSize: "12px",
                          display: "block",
                        }}
                      >
                        STATUS
                      </Text>
                      <Text strong style={{ textTransform: "capitalize" }}>
                        {smokingProgress.status}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px",
                        background: "#fafafa",
                        borderRadius: "4px",
                      }}
                    >
                      <Text
                        style={{
                          color: "#8c8c8c",
                          fontSize: "12px",
                          display: "block",
                        }}
                      >
                        PLAN RESULT
                      </Text>
                      <Text strong style={{ textTransform: "capitalize" }}>
                        {smokingProgress.planResult}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px",
                        background: "#fafafa",
                        borderRadius: "4px",
                      }}
                    >
                      <Text
                        style={{
                          color: "#8c8c8c",
                          fontSize: "12px",
                          display: "block",
                        }}
                      >
                        CIGARETTES/DAY
                      </Text>
                      <Text strong>{smokingProgress.cigarettesPerDay}</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px",
                        background: "#fafafa",
                        borderRadius: "4px",
                      }}
                    >
                      <Text
                        style={{
                          color: "#8c8c8c",
                          fontSize: "12px",
                          display: "block",
                        }}
                      >
                        CIGARETTES/PACK
                      </Text>
                      <Text strong>{smokingProgress.cigarettesPerPack}</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px",
                        background: "#fafafa",
                        borderRadius: "4px",
                      }}
                    >
                      <Text
                        style={{
                          color: "#8c8c8c",
                          fontSize: "12px",
                          display: "block",
                        }}
                      >
                        PACK COST
                      </Text>
                      <Text strong>{smokingProgress.cigarettePackCost}</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Appointment;
