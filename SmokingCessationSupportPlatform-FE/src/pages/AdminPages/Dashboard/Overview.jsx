import React from 'react';
import AdminLayout from '../../../components/layout/AdminLayout.jsx';
import { Row, Col, Card, Typography, Button, Space, DatePicker, Select, Tag } from 'antd';
import { DownloadOutlined, ReloadOutlined, UserOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import Revenue from '../../../components/admin/dashboard/RevenueBlock/Revenue';
import UserGrowth from '../../../components/admin/dashboard/UserGrowthBlock/UserGrowth';
import QuitRate from '../../../components/admin/dashboard/QuitRateBlock/QuitRate';
import OverallMembers from '../../../components/admin/dashboard/OverallMembersBlock/OverallMembers';
import SuccessRate from '../../../components/admin/dashboard/SuccessRateBlock/SuccessRate';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Color constants for maintainability - Desert Sand Theme
const PRIMARY_COLOR = "#062A74";     // Primary text navy
const SUCCESS_COLOR = "#52C41A";     // Green for success/growth
const FAILED_COLOR = "#FF4D4F";      // Red for failure/decline
const WARNING_COLOR = "#FFAA00";     // Orange for warnings
const ACCENT_COLOR = "#FFC658";      // Desert Sand yellow
const SECONDARY_COLOR = "#5572AF";   // Secondary text blue

// UI Color Palette
const UI_COLORS = {
  totalUsers: "#1677ff",
  activeUsers: "#16c784", 
  totalRevenue: "#f4b400",
  avgQuitDays: "#ff4d4f",
  cardBg: {
    totalUsers: "#f5faff",
    activeUsers: "#f6fffa",
    totalRevenue: "#fffbe6",
    avgQuitDays: "#fff1f0"
  },
  filterTag: "#e6f4ff"
};

const statCards = [
  {
    title: 'Total Users',
    value: '1,000',
    icon: <UserOutlined style={{ fontSize: 28, color: UI_COLORS.totalUsers }} />,
    color: UI_COLORS.cardBg.totalUsers,
    change: '+12%',
    changeColor: SUCCESS_COLOR,
  },
  {
    title: 'Active Users',
    value: '850',
    icon: <UserOutlined style={{ fontSize: 28, color: UI_COLORS.activeUsers }} />,
    color: UI_COLORS.cardBg.activeUsers,
    change: '+8%',
    changeColor: SUCCESS_COLOR,
  },
  {
    title: 'Total Revenue',
    value: '119.6M VND',
    icon: <DollarOutlined style={{ fontSize: 28, color: UI_COLORS.totalRevenue }} />,
    color: UI_COLORS.cardBg.totalRevenue,
    change: '+15%',
    changeColor: SUCCESS_COLOR,
  },
  {
    title: 'Avg. Quit Days',
    value: '28',
    icon: <CalendarOutlined style={{ fontSize: 28, color: UI_COLORS.avgQuitDays }} />,
    color: UI_COLORS.cardBg.avgQuitDays,
    change: '+5 days',
    changeColor: SUCCESS_COLOR,
  },
];

const Overview = () => {
  return (
    <AdminLayout title="Dashboard Overview">
      <div style={{ padding: 24, height: '100%', width: '100%' }}>
        {/* Title and Export */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2} style={{ marginBottom: 0 }}>Dashboard</Title>
            <Text type="secondary">Comprehensive analytics for your smoking cessation program</Text>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<DownloadOutlined />}>Export All</Button>
              <Text type="secondary" style={{ fontSize: 12 }}>Last updated: 8:50:06 PM</Text>
            </Space>
          </Col>
        </Row>
        {/* Stat Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {statCards.map((card, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card bordered={false} style={{ background: card.color, borderRadius: 12 }}>
                <Row align="middle" justify="space-between">
                  <Col>
                    <Text type="secondary">{card.title}</Text>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{card.value}</div>
                    <Text style={{ color: card.changeColor }}>{card.change}</Text>
                  </Col>
                  <Col>
                    <div style={{ background: '#fff', borderRadius: '50%', padding: 8, boxShadow: '0 2px 8px #eee' }}>{card.icon}</div>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Dashboard Filters */}
        <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: 16 }}>
          <Row align="middle" gutter={[8, 8]} wrap>
            <Col><Tag icon={<UserOutlined />} color={UI_COLORS.filterTag} style={{ fontWeight: 500, fontSize: 16, background: UI_COLORS.filterTag, border: 'none', color: UI_COLORS.totalUsers }}>Dashboard Filters</Tag></Col>
            {/* Time Range */}
            <Col><Select defaultValue="Last 7 days" style={{ width: 140 }} options={[
              { value: 'Last 7 days', label: 'Last 7 days' },
              { value: 'Last 30 days', label: 'Last 30 days' },
              { value: 'Last 90 days', label: 'Last 90 days' },
            ]} /></Col>
            {/* Tiers */}
            <Col>
              <Space>
                <span>Tier:</span>
                <Select defaultValue="All Tiers" style={{ width: 100 }} options={[
                  { value: 'All Tiers', label: 'All Tiers' },
                  { value: 'Free', label: 'Free' },
                  { value: 'Premium', label: 'Premium' },
                ]} />
              </Space>
            </Col>
            {/* Coach */}
            <Col>
              <Space>
                <span>Coaches:</span>
                <Select defaultValue="Top 5" style={{ width: 100 }} options={[
                  { value: 'Top 5', label: 'Top 5' },
                  { value: 'Top 10', label: 'Top 10' },
                ]} />
              </Space>
            </Col>
            <Col><RangePicker format="DD/MM/YYYY" /></Col>
            <Col><Button icon={<ReloadOutlined />} type="primary">Refresh</Button></Col>
          </Row>
        </Card>

        {/* Chart User Growth - Full Width First */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <Card title={<span>User Growth</span>} bordered={false} style={{ height: '100%' }}>
              <UserGrowth />
            </Card>
          </Col>
        </Row>

        {/* Other Charts Row */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card title={<span>Total Revenue</span>} bordered={false} style={{ height: '100%' }}>
              <Revenue />
            </Card>
          </Col>
          {/* Chart Member Type Distribution */}
          <Col xs={24} lg={12}>
            <Card title={<span>Member Type Distribution</span>} bordered={false} style={{ height: '100%' }}>
              <QuitRate />
            </Card>
          </Col>
        </Row>

        {/* Bottom Charts Row */}
        <Row gutter={[24, 24]}>
          {/* Chart Overall Members */}
          <Col xs={24} lg={12}>
            <Card title={<span>Overall Members Distribution</span>} bordered={false} style={{ height: '100%' }}>
              <OverallMembers />
            </Card>
          </Col>
          {/* Chart Success Rate Over The Months */}
          <Col xs={24} lg={12}>
            <Card title={<span>Success Rate Over The Months</span>} bordered={false} style={{ height: '100%' }}>
              <SuccessRate />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default Overview;