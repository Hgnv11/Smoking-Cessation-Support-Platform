import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, MessageOutlined } from '@ant-design/icons';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard" style={{ padding: '24px' }}>
      <h1>Admin Dashboard</h1>
      
      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Coaches"
              value={15}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Messages"
              value={256}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Recent Activities">
            {/* Add your activity list or other admin features here */}
            <p>Welcome to the admin dashboard. Here you can manage users, coaches, and monitor platform activities.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard; 