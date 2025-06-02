import React from 'react';
import { Card, Table, Button, Typography } from 'antd';

const { Title } = Typography;

const LeaderboardSection: React.FC = () => {
  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Days Smoke-Free',
      dataIndex: 'days',
      key: 'days',
    },
    {
      title: 'Money Saved',
      dataIndex: 'money',
      key: 'money',
    },
    {
      title: 'Achievements',
      dataIndex: 'achievements',
      key: 'achievements',
    },
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
    },
  ];

  const data = [
    {
      key: '1',
      user: 'David Wilson',
      days: '238',
      money: '$4,380',
      achievements: '16',
      rank: '1',
    },
    {
      key: '2',
      user: 'David Wilson',
      days: '238',
      money: '$4,380',
      achievements: '16',
      rank: '2',
    },
    {
      key: '3',
      user: 'David Wilson',
      days: '238',
      money: '$4,380',
      achievements: '16',
      rank: '3',
    },
  ];

  return (
    <section className="leaderboard-section">
      <div className="container">
        <Title level={2} className="section-title">Leaderboard</Title>
        <Card className="leaderboard-card">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            className="leaderboard-table"
          />
        </Card>
        <div className="view-more-container">
          <Button type="primary" size="large">View More</Button>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;