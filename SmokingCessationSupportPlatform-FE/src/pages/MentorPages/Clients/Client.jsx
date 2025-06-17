import React, { useState } from "react";
import {
  Card,
  Avatar,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Input,
  Select,
  Progress,
  Tag,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  MessageOutlined,
  MailOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import styles from './Client.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

export const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock client data based on the image
  const clients = [
    {
      id: 1,
      name: "Matthew Paul",
      email: "james.wilson@example.com",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      joinDate: "December 10, 2023",
      status: "Premium",
      smokeFreedays: 15,
      cigarettesAvoided: 300,
      moneySaved: 200,
      cravingLevel: "High", // High, Moderate, Low
      cravingProgress: 85,
    },
    {
      id: 2,
      name: "Sophia Rodriguez",
      email: "sophia.rodriguez@example.com",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      joinDate: "November 25, 2023",
      status: "Premium",
      smokeFreedays: 28,
      cigarettesAvoided: 560,
      moneySaved: 420,
      cravingLevel: "Moderate",
      cravingProgress: 45,
    },
    {
      id: 3,
      name: "David Chen",
      email: "david.chen@example.com",
      avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      joinDate: "January 5, 2024",
      status: "Basic",
      smokeFreedays: 7,
      cigarettesAvoided: 140,
      moneySaved: 105,
      cravingLevel: "Low",
      cravingProgress: 20,
    },
    {
      id: 4,
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      joinDate: "October 15, 2023",
      status: "Premium",
      smokeFreedays: 45,
      cigarettesAvoided: 900,
      moneySaved: 675,
      cravingLevel: "Low",
      cravingProgress: 15,
    },
  ];

  const getCravingColor = (level) => {
    switch (level) {
      case "High":
        return "#ff4d4f";
      case "Moderate":
        return "#faad14";
      case "Low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const getStatusColor = (status) => {
    return status === "Premium" ? "#722ed1" : "#1890ff";
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         client.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Title level={2} className={styles.pageTitle}>
        Client Management
      </Title>

      {/* Search and Filter */}
      <Row gutter={16} className={styles.searchFilterRow}>
        <Col span={12}>
          <Input
            placeholder="Search by name or email"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </Col>
        <Col span={6}>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            className={styles.filterSelect}
          >
            <Option value="all">All clients</Option>
            <Option value="premium">Premium</Option>
            <Option value="basic">Basic</Option>
          </Select>
        </Col>
      </Row>
      {/* Summary Stats */}
      <Card className={styles.summaryCard}>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic
              title="Total Clients"
              value={clients.length}
              className={styles.totalClientsStatistic}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Premium Clients"
              value={clients.filter(c => c.status === "Premium").length}
              className={styles.premiumClientsStatistic}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="High Craving Clients"
              value={clients.filter(c => c.cravingLevel === "High").length}
              className={styles.highCravingClientsStatistic}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Money Saved"
              value={clients.reduce((sum, c) => sum + c.moneySaved, 0)}
              prefix="$"
              className={styles.moneySavedStatistic}
            />
          </Col>
        </Row>
      </Card>

      {/* Client Cards Grid */}
      <Row gutter={[24, 24]}>
        {filteredClients.map((client) => (
          <Col key={client.id} span={12}>
            <Card className={styles.clientCard}>
              {/* Client Header */}
              <div className={styles.clientHeader}>
                <Row justify="space-between" align="top">
                  <Col>
                    <Space size={16}>
                      <Avatar size={64} src={client.avatar}>
                        {client.name.split(" ").map(n => n[0]).join("")}
                      </Avatar>
                      <div>
                        <Title level={4} className={styles.clientName}>
                          {client.name}
                        </Title>
                        <Space direction="vertical" size={2}>
                          <Space size={8}>
                            <MailOutlined className={styles.icon} />
                            <Text type="secondary" className={styles.clientDetail}>
                              {client.email}
                            </Text>
                          </Space>
                          <Space size={8}>
                            <CalendarOutlined className={styles.icon} />
                            <Text type="secondary" className={styles.clientDetail}>
                              Joined {client.joinDate}
                            </Text>
                          </Space>
                        </Space>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    <Space direction="vertical" align="end" size={8}>
                      <Tag color={getStatusColor(client.status)}>
                        {client.status}
                      </Tag>
                      <Space size={8}>
                        <Button 
                          type="primary" 
                          size="small"
                          className={styles.actionButton}
                        >
                          View Details
                        </Button>
                        <Button 
                          type="default" 
                          size="small" 
                          icon={<MessageOutlined />}
                          className={styles.actionButton}
                        />
                      </Space>
                    </Space>
                  </Col>
                </Row>
              </div>

              {/* Progress Overview */}
              <div className={styles.progressOverview}>
                <Title level={5} className={styles.sectionTitle}>
                  Progress Overview
                </Title>
                
                <Row gutter={24}>
                  <Col span={8}>
                    <div className={styles.statBox}>
                      <Text type="secondary" className={styles.statLabel}>
                        Smoke-Free Days
                      </Text>
                      <div className={styles.smokeFreeValue}>
                        {client.smokeFreedays}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.statBox}>
                      <Text type="secondary" className={styles.statLabel}>
                        Cigarettes Avoided
                      </Text>
                      <div className={styles.cigarettesValue}>
                        {client.cigarettesAvoided}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.statBox}>
                      <Text type="secondary" className={styles.statLabel}>
                        Money Saved
                      </Text>
                      <div className={styles.moneySavedValue}>
                        ${client.moneySaved}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Craving Intensity */}
              <div>
                <div className={styles.cravingHeader}>
                  <Text strong className={styles.cravingTitle}>
                    Craving Intensity
                  </Text>
                  <Tag color={getCravingColor(client.cravingLevel)}>
                    {client.cravingLevel}
                  </Tag>
                </div>
                <Progress
                  percent={client.cravingProgress}
                  strokeColor={getCravingColor(client.cravingLevel)}
                  trailColor="#f0f0f0"
                  strokeWidth={8}
                  showInfo={false}
                  className={styles.cravingProgress}
                />
                <div className={styles.cravingLabels}>
                  <Text type="secondary" className={styles.cravingLabel}>Low</Text>
                  <Text type="secondary" className={styles.cravingLabel}>Moderate</Text>
                  <Text type="secondary" className={styles.cravingLabel}>High</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};
export default Clients;