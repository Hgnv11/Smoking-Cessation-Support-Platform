import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Typography,
  Space,
  Tabs,
  Row,
  Col,
  Progress,
  Tag,
  Modal,
  Input,
  Statistic,
  List,
  Badge,
  Spin,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  DollarOutlined,
  FireOutlined,
  VideoCameraOutlined,
  EditOutlined,
  EyeOutlined,
  CalendarOutlined, 
} from "@ant-design/icons";
import { coachService } from "../../../services/coachService";
import styles from "./ClientDetails.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const MentorClientDetails = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [coachNotes, setCoachNotes] = useState("");
  const [clientData, setClientData] = useState(null);
  const [smokingProgress, setSmokingProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [latestConsultationId, setLatestConsultationId] = useState(null);

  /**
   * Chuyển số slot thành chuỗi thời gian
   */
  const slotNumberToTime = (slotNumber) => {
    const times = ["09:00", "10:00", "11:00", "14:00"];
    return times[slotNumber] || "00:00";
  };

  /**
   * Ánh xạ trạng thái consultation sang trạng thái client
   */
  const mapConsultationStatusToClientStatus = (consultationStatus) => {
    switch(consultationStatus) {
      case "completed": return "completed";
      case "scheduled": return "active";
      case "missed": return "at-risk";
      case "cancelled": return "inactive";
      default: return "active";
    }
  };

  useEffect(() => {
    /**
     * Tạo dữ liệu client từ consultations và smoking progress
     */
    const buildClientData = (consultations, progressData) => {
      // Tìm consultations của client hiện tại
      const clientConsultations = consultations.filter(
        consultation => consultation.user.userId.toString() === clientId
      );

      if (clientConsultations.length === 0) {
        return null; // Client không tồn tại
      }

      // Lấy thông tin client từ consultation đầu tiên
      const firstConsultation = clientConsultations[0];
      const user = firstConsultation.user;

      // Xây dựng consultation history
      const consultationHistory = clientConsultations.map(consultation => ({
        id: consultation.consultationId,
        type: "Video Consultation",
        date: consultation.slot.slotDate,
        time: slotNumberToTime(consultation.slot.slotNumber),
        status: consultation.status,
        notes: consultation.notes || "No notes available for this consultation.",
        rating: consultation.rating,
        feedback: consultation.feedback
      }));        // Xác định trạng thái client
        const latestStatus = clientConsultations
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.status;

        // Lấy consultation mới nhất để lưu notes
        const latestConsultation = clientConsultations
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        // Sử dụng dữ liệu từ smoking progress nếu có
        const progress = progressData || {};
      
      return {
        id: user.userId,
        name: user.fullName || user.profileName || "Unknown Client",
        email: user.email || "N/A",
        avatar: user.avatarUrl || "",
        status: mapConsultationStatusToClientStatus(latestStatus),
        joinDate: firstConsultation.createdAt,
        currentProgress: {
          daysSmokeFreee: progress.daysSinceStart || 0,
          cravingLevel: progress.averageCravingLevel || 5,
          nextSession: null // Có thể tính toán từ scheduled consultations
        },
        detailedInfo: {
          totalSavings: progress.moneySaved || 0,
          consultationsAttended: clientConsultations.filter(c => c.status === "completed").length,
          motivations: ["Improve health", "Save money", "Family"], // Default values
          goals: ["30 days smoke-free", "Reduce daily cigarettes"], // Default values
          notes: latestConsultation?.notes || "", // Lấy notes từ consultation mới nhất
          consultationHistory: consultationHistory,
          cigarettesPerDay: progress.cigarettesPerDay || 0,
          cigarettesAvoided: progress.cigarettesAvoided || 0,
          smokingHistoryByDate: progress.smokingHistoryByDate || {}
        },
        latestConsultationId: latestConsultation?.consultationId || null
      };
    };

    const fetchClientData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi API để lấy consultations và smoking progress
        const [consultations, progressData] = await Promise.all([
          coachService.getMentorConsultations(),
          coachService.getUserSmokingProgress(clientId).catch(() => null) // Không bắt buộc có progress data
        ]);

        // Xây dựng dữ liệu client
        const clientInfo = buildClientData(consultations, progressData?.[0]);
        
        if (!clientInfo) {
          setError("Client not found");
          return;
        }

        setClientData(clientInfo);
        setSmokingProgress(progressData?.[0]);
        setLatestConsultationId(clientInfo.latestConsultationId);
        
        if (clientInfo?.detailedInfo?.notes) {
          setCoachNotes(clientInfo.detailedInfo.notes);
        }
      } catch (err) {
        setError("Failed to load client data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading client details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          onClick={() => navigate("/mentor/clients")}
          style={{ marginTop: 16 }}
        >
          Back to Clients List
        </Button>
      </div>
    );
  }

  // Handle case where client is not found
  if (!clientData) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Title level={2}>Client Not Found</Title>
        <Paragraph>
          The client with ID "{clientId}" could not be found.
        </Paragraph>
        <Button type="primary" onClick={() => navigate("/mentor/clients")}>
          Back to Clients List
        </Button>
      </div>
    );
  }

  const handleBackToList = () => {
    navigate("/mentor/clients");
  };

  const handleViewConsultationNotes = (consultation) => {
    setSelectedConsultation(consultation);
    setNotesModalVisible(true);
  };

  const getCravingColor = (intensity) => {
    if (intensity <= 3) return "#52c41a";
    if (intensity <= 6) return "#faad14";
    return "#ff4d4f";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#52c41a";
      case "at-risk":
        return "#ff4d4f";
      case "completed":
        return "#1890ff";
      case "inactive":
        return "#d9d9d9";
      default:
        return "#1890ff";
    }
  };

  const saveCoachNotes = async () => {
    if (!latestConsultationId || !coachNotes.trim()) {
      Modal.warning({
        title: 'Cannot Save Notes',
        content: 'No consultation found or notes are empty. Please ensure there is at least one consultation for this client.',
      });
      return;
    }

    setSavingNotes(true);
    try {
      await coachService.addConsultationNote(latestConsultationId, coachNotes);
      
      // Cập nhật local state
      setClientData(prev => ({
        ...prev,
        detailedInfo: {
          ...prev.detailedInfo,
          notes: coachNotes
        }
      }));

      Modal.success({
        title: 'Notes Saved',
        content: 'Your notes have been saved successfully.',
      });
    } catch (error) {
      console.error("Failed to save notes:", error);
      Modal.error({
        title: 'Save Failed',
        content: 'Failed to save notes. Please try again.',
      });
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <>
      {/* Header with Back Button */}
      <div className={styles.headerSection}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToList}
          className={styles.backButton}
        >
          Back to Clients
        </Button>
        <div className={styles.breadcrumb}>
          <Text type="secondary">Pages</Text>
          <Text type="secondary" className={styles.separator}>
            /
          </Text>
          <Text type="secondary">Clients</Text>
          <Text type="secondary" className={styles.separator}>
            /
          </Text>
          <Text strong>{clientData.name}</Text>
        </div>
      </div>

      {/* Client Header */}
      <Card className={styles.clientHeaderCard}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Avatar
              size={80}
              src={clientData.avatar}
              className={styles.clientAvatar}
            >
              {clientData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
          </Col>
          <Col span={16}>
            <Space direction="vertical" size="small">
              <Title level={2} className={styles.clientName}>
                {clientData.name}
              </Title>
              <Text type="secondary" className={styles.clientEmail}>
                {clientData.email}
              </Text>
              <Space>
                <Tag color={getStatusColor(clientData.status)}>
                  {clientData.status}
                </Tag>
                <Text type="secondary">
                  Joined: {new Date(clientData.joinDate).toLocaleDateString()}
                </Text>
              </Space>
            </Space>
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              icon={<VideoCameraOutlined />}
              block
              className={styles.videoCallButton}
            >
              Start Video Call
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      <Card className={styles.tabsCard}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="Overview" key="overview">
            <Row gutter={24}>
              <Col span={6}>
                <Card className={styles.statCard}>
                  <Statistic
                    title="Smoke-Free Days"
                    value={clientData.currentProgress.daysSmokeFreee}
                    prefix={<FireOutlined className={styles.smokeFreeIcon} />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className={styles.statCard}>
                  <Statistic
                    title="Money Saved"
                    value={clientData.detailedInfo.totalSavings}
                    prefix={<DollarOutlined className={styles.moneyIcon} />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className={styles.statCard}>
                  <div className={styles.cravingCard}>
                    <Text type="secondary" className={styles.cravingTitle}>
                      Current Craving Level
                    </Text>
                    <div className={styles.cravingProgress}>
                      <Progress
                        type="circle"
                        size={80}
                        percent={(clientData.currentProgress.cravingLevel / 10) * 100}
                        strokeColor={getCravingColor(
                          clientData.currentProgress.cravingLevel
                        )}
                        format={() => `${clientData.currentProgress.cravingLevel}/10`}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className={styles.statCard}>
                  <Statistic
                    title="Total Consultations"
                    value={clientData.detailedInfo.consultationsAttended}
                    prefix={
                      <VideoCameraOutlined
                        className={styles.consultationIcon}
                      />
                    }
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Plan & Notes" key="plan">
            <Row gutter={24}>
              <Col span={12}>
                <Card
                  title="Motivation & Goals"
                  className={styles.motivationCard}
                >
                  <div className={styles.motivationSection}>
                    <Title level={5} className={styles.sectionTitle}>
                      Initial Motivation
                    </Title>
                    <Paragraph className={styles.motivationText}>
                      {clientData.detailedInfo.motivations.join(", ")}
                    </Paragraph>
                  </div>
                  <div className={styles.goalsSection}>
                    <Title level={5} className={styles.sectionTitle}>
                      Goals
                    </Title>
                    <Paragraph className={styles.goalsText}>
                      {clientData.detailedInfo.goals.join(", ")}
                    </Paragraph>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Coach's Private Notes"
                  className={styles.notesCard}
                  extra={
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={saveCoachNotes}
                      loading={savingNotes}
                      disabled={!coachNotes.trim() || !latestConsultationId}
                      className={styles.saveNotesButton}
                    >
                      Save Notes
                    </Button>
                  }
                >
                  <TextArea
                    rows={8}
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                    placeholder="Add your private notes about this client..."
                    className={styles.notesTextArea}
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Consultation History" key="history">
            <List
              itemLayout="horizontal"
              dataSource={clientData.detailedInfo.consultationHistory}
              className={styles.consultationList}
              renderItem={(consultation) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewConsultationNotes(consultation)}
                      className={styles.viewNotesButton}
                    >
                      View Notes
                    </Button>,
                  ]}
                  className={styles.consultationItem}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<VideoCameraOutlined />}
                        className={styles.consultationAvatar}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{consultation.type}</Text>
                        <Badge status="success" />
                        {consultation.rating > 0 && (
                          <Text type="secondary">({consultation.rating}/5 stars)</Text>
                        )}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">
                          {new Date(consultation.date).toLocaleDateString()} at {consultation.time}
                        </Text>
                        {consultation.feedback && (
                          <Text italic>"{consultation.feedback}"</Text>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Tabs.TabPane>

          {/* Smoking Progress Tab - hiển thị nếu có dữ liệu */}
          {smokingProgress && (
            <Tabs.TabPane tab="Smoking Progress" key="progress">
              <Row gutter={24}>
                <Col span={8}>
                  <Card className={styles.statCard}>
                    <Statistic
                      title="Cigarettes Per Day"
                      value={smokingProgress.cigarettesPerDay}
                      valueStyle={{ color: "#ff4d4f" }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card className={styles.statCard}>
                    <Statistic
                      title="Cigarettes Avoided"
                      value={smokingProgress.cigarettesAvoided}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card className={styles.statCard}>
                    <Statistic
                      title="Days Since Start"
                      value={smokingProgress.daysSinceStart}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Recent Smoking History */}
              {smokingProgress.smokingHistoryByDate && 
               Object.keys(smokingProgress.smokingHistoryByDate).length > 0 && (
                <Card 
                  title="Recent Smoking History" 
                  style={{ marginTop: 24 }}
                  className={styles.smokingHistoryCard}
                >
                  {Object.entries(smokingProgress.smokingHistoryByDate)
                    .slice(-7) // Hiển thị 7 ngày gần nhất
                    .map(([date, events]) => (
                      <div key={date} style={{ marginBottom: 16 }}>
                        <Title level={5}>{date}</Title>
                        <List
                          size="small"
                          dataSource={events}
                          renderItem={(event) => (
                            <List.Item>
                              <List.Item.Meta
                                title={
                                  <Space>
                                    <Text strong>{event.cigarettesSmoked} cigarettes</Text>
                                    <Tag color={getCravingColor(event.cravingLevel)}>
                                      Craving: {event.cravingLevel}/10
                                    </Tag>
                                  </Space>
                                }
                                description={
                                  <Space direction="vertical" size="small">
                                    <Text type="secondary">
                                      {new Date(event.eventTime).toLocaleTimeString()}
                                    </Text>
                                    {event.notes && <Text italic>{event.notes}</Text>}
                                  </Space>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </div>
                    ))}
                </Card>
              )}
            </Tabs.TabPane>
          )}
        </Tabs>
      </Card>

      {/* Consultation Notes Modal */}
      <Modal
        title={`Consultation Notes - ${selectedConsultation?.date}`}
        open={notesModalVisible}
        onCancel={() => setNotesModalVisible(false)}
        footer={null}
        width={600}
        className={styles.consultationModal}
      >
        {selectedConsultation && (
          <div className={styles.modalContent}>
            <div className={styles.modalField}>
              <Text strong>Type: </Text>
              <Text>{selectedConsultation.type}</Text>
            </div>
            <div className={styles.modalField}>
              <Text strong>Date: </Text>
              <Text>
                {new Date(selectedConsultation.date).toLocaleDateString()}
              </Text>
            </div>
            <div className={styles.modalNotes}>
              <Text strong>Notes:</Text>
              <Paragraph className={styles.modalNotesText}>
                {selectedConsultation.notes}
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MentorClientDetails;
