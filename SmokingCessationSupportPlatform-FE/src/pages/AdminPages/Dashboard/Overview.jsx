import React from 'react';
import AdminLayout from '../../../components/layout/AdminLayout.jsx';
import { Row, Col, Card, Typography, Button, Space, DatePicker, Select, Tag } from 'antd';
import { DownloadOutlined, ReloadOutlined, UserOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';

// Chart Components
import Revenue from '../../../components/admin/dashboard/RevenueBlock/Revenue';
import UserGrowth from '../../../components/admin/dashboard/UserGrowthBlock/UserGrowth';
import QuitRate from '../../../components/admin/dashboard/QuitRateBlock/QuitRate';
import OverallMembers from '../../../components/admin/dashboard/OverallMembersBlock/OverallMembers';
import SuccessRate from '../../../components/admin/dashboard/SuccessRateBlock/SuccessRate';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Theme Colors
const THEME_COLORS = {
  primary: "#062A74",
  success: "#52C41A", 
  danger: "#FF4D4F",
  warning: "#FFAA00",
  accent: "#FFC658",
  secondary: "#5572AF"
};

// UI Colors for Components
const UI_COLORS = {
  cards: {
    totalUsers: "#1677ff",
    activeUsers: "#16c784", 
    totalRevenue: "#f4b400",
    avgQuitDays: "#ff4d4f"
  },
  backgrounds: {
    totalUsers: "#f5faff",
    activeUsers: "#f6fffa",
    totalRevenue: "#fffbe6",
    avgQuitDays: "#fff1f0"
  },
  filter: "#e6f4ff"
};

// Dashboard Statistics Configuration
const STAT_CARDS_CONFIG = [
  {
    title: 'Total Users',
    value: '1,000',
    change: '+12%',
    icon: UserOutlined,
    colorKey: 'totalUsers'
  },
  {
    title: 'Active Users', 
    value: '850',
    change: '+8%',
    icon: UserOutlined,
    colorKey: 'activeUsers'
  },
  {
    title: 'Total Revenue',
    value: '119.6M VND',
    change: '+15%',
    icon: DollarOutlined,
    colorKey: 'totalRevenue'
  },
  {
    title: 'Avg. Quit Days',
    value: '28',
    change: '+5 days',
    icon: CalendarOutlined,
    colorKey: 'avgQuitDays'
  }
];

// Filter Options Configuration
const FILTER_OPTIONS = {
  timeRange: [
    { value: 'Last 7 days', label: 'Last 7 days' },
    { value: 'Last 30 days', label: 'Last 30 days' },
    { value: 'Last 90 days', label: 'Last 90 days' }
  ],
  tiers: [
    { value: 'All Tiers', label: 'All Tiers' },
    { value: 'Free', label: 'Free' },
    { value: 'Premium', label: 'Premium' }
  ],
  coaches: [
    { value: 'Top 5', label: 'Top 5' },
    { value: 'Top 10', label: 'Top 10' }
  ]
};

// Chart Configuration
const CHART_CONFIG = [
  {
    title: 'User Growth',
    component: UserGrowth,
    span: { xs: 24 }, // Full width
    key: 'userGrowth'
  },
  {
    title: 'Total Revenue',
    component: Revenue,
    span: { xs: 24, lg: 12 },
    key: 'revenue'
  },
  {
    title: 'Member Type Distribution',
    component: QuitRate,
    span: { xs: 24, lg: 12 },
    key: 'memberType'
  },
  {
    title: 'Overall Members Distribution',
    component: OverallMembers,
    span: { xs: 24, lg: 12 },
    key: 'overallMembers'
  },
  {
    title: 'Success Rate Over The Months',
    component: SuccessRate,
    span: { xs: 24, lg: 12 },
    key: 'successRate'
  }
];

// Component: Dashboard Header
const DashboardHeader = () => (
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
);

// Component: Statistics Card
const StatCard = ({ config }) => {
  const IconComponent = config.icon;
  return (
    <Card 
      bordered={false} 
      style={{ 
        background: UI_COLORS.backgrounds[config.colorKey], 
        borderRadius: 12 
      }}
    >
      <Row align="middle" justify="space-between">
        <Col>
          <Text type="secondary">{config.title}</Text>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{config.value}</div>
          <Text style={{ color: THEME_COLORS.success }}>{config.change}</Text>
        </Col>
        <Col>
          <div style={{ 
            background: '#fff', 
            borderRadius: '50%', 
            padding: 8, 
            boxShadow: '0 2px 8px #eee' 
          }}>
            <IconComponent style={{ 
              fontSize: 28, 
              color: UI_COLORS.cards[config.colorKey] 
            }} />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

// Component: Dashboard Filters
const DashboardFilters = () => (
  <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: 16 }}>
    <Row align="middle" gutter={[8, 8]} wrap>
      <Col>
        <Tag 
          icon={<UserOutlined />} 
          style={{ 
            fontWeight: 500, 
            fontSize: 16, 
            background: UI_COLORS.filter, 
            border: 'none', 
            color: UI_COLORS.cards.totalUsers 
          }}
        >
          Dashboard Filters
        </Tag>
      </Col>
      
      <Col>
        <Select 
          defaultValue="Last 7 days" 
          style={{ width: 140 }} 
          options={FILTER_OPTIONS.timeRange} 
        />
      </Col>
      
      <Col>
        <Space>
          <span>Tier:</span>
          <Select 
            defaultValue="All Tiers" 
            style={{ width: 100 }} 
            options={FILTER_OPTIONS.tiers} 
          />
        </Space>
      </Col>
      
      <Col>
        <Space>
          <span>Coaches:</span>
          <Select 
            defaultValue="Top 5" 
            style={{ width: 100 }} 
            options={FILTER_OPTIONS.coaches} 
          />
        </Space>
      </Col>
      
      <Col>
        <RangePicker format="DD/MM/YYYY" />
      </Col>
      
      <Col>
        <Button icon={<ReloadOutlined />} type="primary">Refresh</Button>
      </Col>
    </Row>
  </Card>
);

// Component: Chart Grid
const ChartGrid = () => {
  // Split charts into groups for better layout
  const fullWidthCharts = CHART_CONFIG.filter(chart => chart.span.xs === 24 && !chart.span.lg);
  const twoColumnCharts = CHART_CONFIG.filter(chart => chart.span.lg === 12);
  
  return (
    <>
      {/* Full Width Charts */}
      {fullWidthCharts.map((chart, index) => (
        <Row key={chart.key} gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col {...chart.span}>
            <Card title={<span>{chart.title}</span>} bordered={false} style={{ height: '100%' }}>
              <chart.component />
            </Card>
          </Col>
        </Row>
      ))}
      
      {/* Two Column Charts */}
      {twoColumnCharts.reduce((rows, chart, index) => {
        if (index % 2 === 0) {
          rows.push([chart]);
        } else {
          rows[rows.length - 1].push(chart);
        }
        return rows;
      }, []).map((chartRow, rowIndex) => (
        <Row key={`row-${rowIndex}`} gutter={[24, 24]} style={{ marginBottom: 24 }}>
          {chartRow.map((chart) => (
            <Col key={chart.key} {...chart.span}>
              <Card title={<span>{chart.title}</span>} bordered={false} style={{ height: '100%' }}>
                <chart.component />
              </Card>
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
};

// Main Component
const Overview = () => {
  return (
    <AdminLayout title="Dashboard Overview">
      <div style={{ padding: 24, height: '100%', width: '100%' }}>
        <DashboardHeader />
        
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {STAT_CARDS_CONFIG.map((config, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <StatCard config={config} />
            </Col>
          ))}
        </Row>
        
        <DashboardFilters />
        <ChartGrid />
      </div>
    </AdminLayout>
  );
};

export default Overview;