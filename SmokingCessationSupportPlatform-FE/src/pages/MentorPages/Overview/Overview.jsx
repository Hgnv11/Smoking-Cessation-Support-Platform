import styles from "./Overview.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Spin,
  Alert,
  Space,
  Modal,
  Avatar,
  Divider,
} from "antd";
import api from "../../../config/axios";
import { coachService } from "../../../services/coachService";
import AppointmentSVG from "./AppointmentSVG";

const { Title, Text } = Typography;

export const MentorOverview = () => {
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [smokingProgress, setSmokingProgress] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Sử dụng Promise.all để gọi các API song song - thêm getAllMentorConsultations
        const [overviewRes, allSlots, consultations] = await Promise.all([
          coachService.getDashboardOverview(),
          coachService.getAllMentorConsultations(),
          coachService.getMentorConsultations(),
        ]);

        setOverviewStats(overviewRes);

        // Xử lý dữ liệu lịch hẹn chi tiết (sử dụng logic giống Appointment)
        // Lấy ngày hôm nay
        const today = new Date();
        const todayStr = formatDateToString(today);

        // Lọc những slot từ ngày hôm nay trở đi
        const futureSlots = allSlots.filter((slot) => {
          return slot.slotDate >= todayStr;
        });

        // Tạo map để tra cứu consultation details
        const consultationMap = {};
        consultations.forEach((consultation) => {
          const key = `${consultation.slot.slotDate}-${consultation.slot.slotNumber}`;
          consultationMap[key] = consultation;
        });

        // Group by slotDate
        const grouped = {};
        futureSlots.forEach((slot) => {
          const date = slot.slotDate;
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(slot);
        });

        // Convert to array of days
        const days = Object.entries(grouped).map(([date, slots]) => {
          // Chỉ hiển thị những slot có thực, bỏ qua slot không tồn tại
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
                slotNumber: slot.slotNumber,
              };
            } else if (slot.booked) {
              // Trường hợp slot được book nhưng không có trong consultation details
              return {
                time: getSlotTimeRange(slot.slotNumber),
                isAvailable: false,
                clientName: "Booked by User",
                clientId: null,
                consultationId: null,
                meetingLink: null,
                status: "booked",
                slotId: slot.slotId,
                slotNumber: slot.slotNumber,
              };
            } else {
              return {
                time: getSlotTimeRange(slot.slotNumber),
                isAvailable: true,
                statusText: "Available slot",
                slotId: slot.slotId,
                slotNumber: slot.slotNumber,
              };
            }
          });

          // Sắp xếp theo slotNumber
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

        // Sort by date ascending
        days.sort((a, b) => new Date(a.date) - new Date(b.date));
        setScheduleData(days);
      } catch {
        setError("Failed to fetch overview data. Please try again later.");
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

  // Helper: get slot time range like in Appointment
  const getSlotTimeRange = (slotNumber) => {
    const timeRanges = {
      1: "7:00 AM - 9:30 AM",
      2: "9:30 AM - 12:00 PM",
      3: "13:00 PM - 15:30 PM",
      4: "15:30 PM - 18:00 PM",
    };
    return timeRanges[slotNumber] || "";
  };

  // Helper: format date to YYYY-MM-DD
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

  // Handle click on client name
  const handleClientNameClick = (consultationId, userId) => {
    if (consultationId && userId) {
      fetchConsultationDetails(consultationId, userId);
    }
  };

  const handleStartConsultation = (clientName, time, meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, "_blank");
    } else {
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
          <Typography.Title level={4} className={styles.slotTimeText}>
            {getSlotTimeRange(slot.slotNumber) || slot.time}
          </Typography.Title>
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
              {slot.meetingLink && (
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
              )}
            </>
          )}
        </div>
      </Card>
    );
  };

  // Lấy danh sách slot hôm nay
  const today = new Date();
  const todayStr = formatDateToString(today);
  const todaySchedule = scheduleData.find((day) => day.date === todayStr);
  const todaySlots = todaySchedule ? todaySchedule.timeSlots : [];

  if (loading) return <Spin size="large" className={styles.loader} />;
  if (error)
    return (
      <Alert
        type="error"
        message={error}
        showIcon
        className={styles.errorAlert}
      />
    );

  return (
    <div className={styles.overviewPage}>
      <Title level={1} className={styles.pageTitle}>
        Overview
      </Title>

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
          <Title level={3} className={styles.todayTitle}>
            Today's Appointments
          </Title>
        </div>
        {todaySlots.length === 0 ? (
          <div className={styles.emptyState}>
            <AppointmentSVG className={styles.emptySVG} />
            <Text className={styles.emptyText}>
              No appointments scheduled for today
            </Text>
            <Button
              type="primary"
              className={styles.ctaButton}
              onClick={() => navigate("/mentor/appointments")}
            >
              Schedule Appointment
            </Button>
          </div>
        ) : (
          <Row gutter={[16, 16]} className={styles.timeSlotsRow}>
            {todaySlots.map((slot, slotIndex) => (
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
        )}
      </Card>

      {/* Consultation Details Modal */}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: 600,
              color: "#1890ff",
            }}
          >
            <CalendarOutlined style={{ marginRight: 8, fontSize: "20px" }} />
            Consultation Details
          </div>
        }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="close"
            size="large"
            onClick={() => setModalVisible(false)}
            style={{ borderRadius: "8px" }}
          >
            Close
          </Button>,
          selectedConsultation?.meetingLink && (
            <Button
              key="start"
              type="primary"
              size="large"
              onClick={() => {
                window.open(selectedConsultation.meetingLink, "_blank");
                setModalVisible(false);
              }}
              style={{
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                border: "none",
              }}
            >
              Start Consultation
            </Button>
          ),
        ]}
        width={700}
        loading={modalLoading}
        style={{ top: 20 }}
        bodyStyle={{ padding: "24px" }}
      >
        {selectedConsultation && (
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {/* Client Information Card */}
            <Card
              style={{
                marginBottom: 20,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                border: "1px solid #bae7ff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <UserOutlined
                  style={{
                    marginRight: 8,
                    fontSize: "16px",
                    color: "#1890ff",
                  }}
                />
                <Title level={5} style={{ margin: 0, color: "#1890ff" }}>
                  Client Information
                </Title>
              </div>
              <Space align="start" size={16}>
                <Avatar
                  size={80}
                  src={selectedConsultation.user?.avatarUrl}
                  icon={<UserOutlined />}
                  style={{
                    border: "3px solid #ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <Text
                    strong
                    style={{
                      fontSize: 18,
                      display: "block",
                      marginBottom: 4,
                      color: "#262626",
                    }}
                  >
                    {selectedConsultation.user?.fullName}
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 2,
                      color: "#595959",
                    }}
                  >
                    {selectedConsultation.user?.email}
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 2,
                      color: "#595959",
                    }}
                  >
                    Gender: {selectedConsultation.user?.gender || "N/A"}
                  </Text>
                  {selectedConsultation.user?.birthDate && (
                    <Text
                      style={{
                        display: "block",
                        color: "#595959",
                      }}
                    >
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
            <Card
              style={{
                marginBottom: 20,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)",
                border: "1px solid #b7eb8f",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <CalendarOutlined
                  style={{
                    marginRight: 8,
                    fontSize: "16px",
                    color: "#52c41a",
                  }}
                />
                <Title level={5} style={{ margin: 0, color: "#52c41a" }}>
                  Consultation Information
                </Title>
              </div>
              <Row gutter={[24, 12]}>
                <Col span={12}>
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <Text strong style={{ color: "#8c8c8c", fontSize: "12px" }}>
                      DATE
                    </Text>
                    <Text
                      style={{
                        display: "block",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#262626",
                      }}
                    >
                      {new Date(
                        selectedConsultation.slot?.slotDate
                      ).toLocaleDateString("en-GB")}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <Text strong style={{ color: "#8c8c8c", fontSize: "12px" }}>
                      TIME
                    </Text>
                    <Text
                      style={{
                        display: "block",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#262626",
                      }}
                    >
                      {slotTimeFromNumber(
                        selectedConsultation.slot?.slotNumber - 1
                      )}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <Text strong style={{ color: "#8c8c8c", fontSize: "12px" }}>
                      STATUS
                    </Text>
                    <Text
                      style={{
                        display: "block",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#262626",
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedConsultation.status}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <Text strong style={{ color: "#8c8c8c", fontSize: "12px" }}>
                      CREATED
                    </Text>
                    <Text
                      style={{
                        display: "block",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#262626",
                      }}
                    >
                      {new Date(
                        selectedConsultation.createdAt
                      ).toLocaleDateString("en-GB")}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Smoking Cessation Progress Card */}
            {smokingProgress && (
              <Card
                style={{
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                  border: "1px solid #bae7ff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <Title level={5} style={{ margin: 0, color: "#1890ff" }}>
                    Smoking Cessation Progress
                  </Title>
                </div>

                {/* Key Stats Row */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px 16px",
                        background: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#8c8c8c",
                          fontWeight: 500,
                        }}
                      >
                        DAYS SMOKE-FREE
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px 16px",
                        background: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#8c8c8c",
                          fontWeight: 500,
                        }}
                      >
                        MONEY SAVED
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px 16px",
                        background: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#8c8c8c",
                          fontWeight: 500,
                        }}
                      >
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
                        padding: "12px 16px",
                        background: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ color: "#8c8c8c", fontSize: "12px" }}
                      >
                        START DATE
                      </Text>
                      <Text
                        style={{
                          display: "block",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#262626",
                        }}
                      >
                        {new Date(smokingProgress.startDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ color: "#8c8c8c", fontSize: "12px" }}
                      >
                        STATUS
                      </Text>
                      <Text
                        style={{
                          display: "block",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#262626",
                          textTransform: "capitalize",
                        }}
                      >
                        {smokingProgress.status}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ color: "#8c8c8c", fontSize: "12px" }}
                      >
                        PLAN RESULT
                      </Text>
                      <Text
                        style={{
                          display: "block",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#262626",
                          textTransform: "capitalize",
                        }}
                      >
                        {smokingProgress.planResult}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ color: "#8c8c8c", fontSize: "12px" }}
                      >
                        CIGARETTES/DAY
                      </Text>
                      <Text
                        style={{
                          display: "block",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#262626",
                        }}
                      >
                        {smokingProgress.cigarettesPerDay}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ color: "#8c8c8c", fontSize: "12px" }}
                      >
                        CIGARETTES/PACK
                      </Text>
                      <Text
                        style={{
                          display: "block",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#262626",
                        }}
                      >
                        {smokingProgress.cigarettesPerPack}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Text
                        strong
                        style={{ color: "#8c8c8c", fontSize: "12px" }}
                      >
                        PACK COST
                      </Text>
                      <Text
                        style={{
                          display: "block",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#262626",
                        }}
                      >
                        {smokingProgress.cigarettePackCost}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default MentorOverview;
