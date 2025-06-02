import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { SearchOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ExploreSection: React.FC = () => {
  const features = [
    {
      icon: <SearchOutlined className="feature-icon" />,
      title: 'I want to Quit',
      description: 'Find resources to quit smoking and discover new strategies',
    },
    {
      icon: <TeamOutlined className="feature-icon" />,
      title: 'Community',
      description: 'Chat and connect with people who support your decision',
    },
    {
      icon: <FileTextOutlined className="feature-icon" />,
      title: 'Consultation',
      description: 'Get consultation from health care professional',
    },
  ];

  return (
    <section className="explore-section">
      <div className="container">
        <Title level={2} className="section-title">Explore</Title>
        <Row gutter={[24, 24]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={8} key={index}>
              <Card className="feature-card" hoverable>
                <div className="feature-content">
                  {feature.icon}
                  <Title level={4} className="feature-title">{feature.title}</Title>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ExploreSection;