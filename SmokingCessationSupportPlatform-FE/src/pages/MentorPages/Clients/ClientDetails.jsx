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
import { getClientData } from "./mockData"; // ✅ Import từ mockData
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

  useEffect(() => {
    // ✅ Lấy dữ liệu client từ mockData thống nhất
    const data = getClientData(clientId);
    setClientData(data);
    if (data?.detailedInfo?.notes) {
      setCoachNotes(data.detailedInfo.notes);
    }
  }, [clientId]);

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

  const saveCoachNotes = () => {
    console.log("Saving coach notes:", coachNotes);
    // In a real app, this would save to backend
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
                      </Space>
                    }
                    description={
                      <Text type="secondary">
                        {new Date(consultation.date).toLocaleDateString()}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Tabs.TabPane>
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
