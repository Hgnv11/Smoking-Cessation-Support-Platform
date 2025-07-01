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
  Calendar,
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
} from "@ant-design/icons";
import styles from "./ClientDetails.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mock detailed client data
const getClientData = (id) => {
  const clients = {
    1: {
      id: 1,
      name: "Matthew Paul",
      email: "james.wilson@example.com",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      smokeFreedays: 15,
      moneySaved: 200,
      cravingIntensity: 8,
      status: "Premium",
      joinDate: "2023-12-10",
      totalConsultations: 8,
      motivation:
        "I want to be healthy for my family and save money for important expenses.",
      goals:
        "Quit smoking completely within 3 months, save $1000 by the end of the year.",
      coachNotes:
        "Matthew is motivated but struggles with work stress. Focus on stress management techniques and positive reinforcement.",
      progressLog: {
        "2024-06-01": "smoke-free",
        "2024-06-02": "smoke-free",
        "2024-06-03": "relapse",
        "2024-06-04": "smoke-free",
        "2024-06-05": "smoke-free",
        "2024-06-06": "smoke-free",
        "2024-06-07": "smoke-free",
        "2024-06-08": "smoke-free",
        "2024-06-09": "smoke-free",
        "2024-06-10": "smoke-free",
        "2024-06-11": "smoke-free",
        "2024-06-12": "smoke-free",
        "2024-06-13": "smoke-free",
        "2024-06-14": "smoke-free",
        "2024-06-15": "smoke-free",
        "2024-06-16": "smoke-free",
      },
      consultationHistory: [
        {
          id: 1,
          date: "2024-06-10",
          type: "Video Session",
          notes:
            "Discussed coping strategies for stress. Matthew is improving with breathing exercises.",
        },
        {
          id: 2,
          date: "2024-06-03",
          type: "Video Session",
          notes:
            "Addressed relapse on June 3rd. Identified work triggers and created action plan.",
        },
        {
          id: 3,
          date: "2024-05-26",
          type: "Video Session",
          notes:
            "Weekly check-in. Matthew reported strong motivation despite challenges.",
        },
      ],
    },
    2: {
      id: 2,
      name: "Sophia Rodriguez",
      email: "sophia.rodriguez@example.com",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      smokeFreedays: 28,
      moneySaved: 420,
      cravingIntensity: 4,
      status: "Premium",
      joinDate: "2023-11-25",
      totalConsultations: 12,
      motivation:
        "Health concerns and wanting to be a good role model for my children.",
      goals:
        "Complete cessation and maintain smoke-free lifestyle for at least 6 months.",
      coachNotes:
        "Sophia is very consistent and responds well to goal-setting. Continue with current approach.",
      progressLog: {
        "2024-06-01": "smoke-free",
        "2024-06-02": "smoke-free",
        "2024-06-03": "smoke-free",
        "2024-06-04": "smoke-free",
        "2024-06-05": "smoke-free",
        "2024-06-06": "smoke-free",
        "2024-06-07": "smoke-free",
        "2024-06-08": "smoke-free",
        "2024-06-09": "smoke-free",
        "2024-06-10": "smoke-free",
        "2024-06-11": "smoke-free",
        "2024-06-12": "smoke-free",
        "2024-06-13": "smoke-free",
        "2024-06-14": "smoke-free",
        "2024-06-15": "smoke-free",
        "2024-06-16": "smoke-free",
      },
      consultationHistory: [
        {
          id: 1,
          date: "2024-06-12",
          type: "Video Session",
          notes:
            "Excellent progress. Discussed maintaining motivation long-term.",
        },
        {
          id: 2,
          date: "2024-06-05",
          type: "Video Session",
          notes:
            "Weekly check-in. Sophia is doing very well with all aspects of the program.",
        },
      ],
    },
    3: {
      id: 3,
      name: "David Chen",
      email: "david.chen@example.com",
      avatar:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      smokeFreedays: 7,
      moneySaved: 105,
      cravingIntensity: 3,
      status: "Basic",
      joinDate: "2024-01-05",
      totalConsultations: 4,
      motivation:
        "I want to improve my health and set a good example for my family.",
      goals: "Quit smoking within 2 months, save money for family vacation.",
      coachNotes:
        "David shows good progress with low craving intensity. Focus on maintaining motivation and building healthy habits.",
      progressLog: {
        "2024-06-10": "smoke-free",
        "2024-06-11": "smoke-free",
        "2024-06-12": "smoke-free",
        "2024-06-13": "smoke-free",
        "2024-06-14": "smoke-free",
        "2024-06-15": "smoke-free",
        "2024-06-16": "smoke-free",
      },
      consultationHistory: [
        {
          id: 1,
          date: "2024-06-14",
          type: "Video Session",
          notes:
            "David is making excellent progress. Discussed strategies for maintaining motivation.",
        },
        {
          id: 2,
          date: "2024-06-07",
          type: "Video Session",
          notes:
            "Weekly check-in. David reported low cravings and good progress with habit replacement.",
        },
      ],
    },
    4: {
      id: 4,
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      smokeFreedays: 22,
      moneySaved: 330,
      cravingIntensity: 6,
      status: "Premium",
      joinDate: "2023-12-20",
      totalConsultations: 9,
      motivation:
        "I want to improve my lung health and save money for my future.",
      goals: "Achieve 30 smoke-free days and maintain long-term cessation.",
      coachNotes:
        "Emily has moderate cravings but good determination. Continue with current support plan.",
      progressLog: {
        "2024-05-26": "smoke-free",
        "2024-05-27": "smoke-free",
        "2024-05-28": "relapse",
        "2024-05-29": "smoke-free",
        "2024-05-30": "smoke-free",
        "2024-05-31": "smoke-free",
        "2024-06-01": "smoke-free",
        "2024-06-02": "smoke-free",
        "2024-06-03": "smoke-free",
        "2024-06-04": "smoke-free",
        "2024-06-05": "smoke-free",
        "2024-06-06": "smoke-free",
        "2024-06-07": "smoke-free",
        "2024-06-08": "smoke-free",
        "2024-06-09": "smoke-free",
        "2024-06-10": "smoke-free",
        "2024-06-11": "smoke-free",
        "2024-06-12": "smoke-free",
        "2024-06-13": "smoke-free",
        "2024-06-14": "smoke-free",
        "2024-06-15": "smoke-free",
        "2024-06-16": "smoke-free",
      },
      consultationHistory: [
        {
          id: 1,
          date: "2024-06-13",
          type: "Video Session",
          notes:
            "Emily discussed challenges with social situations. Provided coping strategies.",
        },
        {
          id: 2,
          date: "2024-06-06",
          type: "Video Session",
          notes:
            "Good progress overall. Addressed concerns about weight gain after quitting.",
        },
        {
          id: 3,
          date: "2024-05-30",
          type: "Video Session",
          notes: "Weekly check-in. Emily recovered well from recent relapse.",
        },
      ],
    },
  };

  return clients[id];
};

export const MentorClientDetails = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [coachNotes, setCoachNotes] = useState("");
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const data = getClientData(clientId);
    setClientData(data);
    if (data) {
      setCoachNotes(data.coachNotes || "");
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
      case "Premium":
        return "#722ed1";
      case "Basic":
        return "#1890ff";
      case "On Track":
        return "green";
      case "Struggling":
        return "red";
      default:
        return "default";
    }
  };

  const dateCellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const status = clientData.progressLog[dateStr];

    if (status === "smoke-free") {
      return (
        <div className={styles.smokeFreeDay}>
          <div className={styles.smokeFreeIcon}>✓</div>
        </div>
      );
    } else if (status === "relapse") {
      return (
        <div className={styles.relapseDay}>
          <div className={styles.relapseIcon}>✗</div>
        </div>
      );
    }
    return null;
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
                    value={clientData.smokeFreedays}
                    prefix={<FireOutlined className={styles.smokeFreeIcon} />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className={styles.statCard}>
                  <Statistic
                    title="Money Saved"
                    value={clientData.moneySaved}
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
                        percent={(clientData.cravingIntensity / 10) * 100}
                        strokeColor={getCravingColor(
                          clientData.cravingIntensity
                        )}
                        format={() => `${clientData.cravingIntensity}/10`}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className={styles.statCard}>
                  <Statistic
                    title="Total Consultations"
                    value={clientData.totalConsultations}
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

          <Tabs.TabPane tab="Progress Log" key="progress">
            <div className={styles.progressSection}>
              <Title level={4} className={styles.progressTitle}>
                Monthly Progress Calendar
              </Title>
              <Text type="secondary" className={styles.progressDescription}>
                Green days indicate smoke-free days, red days indicate relapse
                days.
              </Text>
            </div>
            <Calendar
              dateCellRender={dateCellRender}
              className={styles.progressCalendar}
            />
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
                      {clientData.motivation}
                    </Paragraph>
                  </div>
                  <div className={styles.goalsSection}>
                    <Title level={5} className={styles.sectionTitle}>
                      Goals
                    </Title>
                    <Paragraph className={styles.goalsText}>
                      {clientData.goals}
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
              dataSource={clientData.consultationHistory}
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
