import React from 'react';
import { Row, Col, Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <Row align="middle" gutter={[48, 24]}>
          <Col xs={24} lg={12}>
            <Title level={1} className="hero-title">
              Your Journey to Quit Smoking Starts Here!
            </Title>
            <Paragraph className="hero-description">
              Track your progress, create personalized plans, and connect with a supportive community to achieve your smoke-free goals.
            </Paragraph>
            <Button type="primary" size="large" className="cta-button">
              Start your quit plan now
            </Button>
          </Col>
          <Col xs={24} lg={12}>
            <div className="hero-illustration">
              <div className="illustration-container">
                <div className="blue-circle"></div>
                <div className="characters">
                  <div className="character character-1">🚭</div>
                  <div className="character character-2">💪</div>
                  <div className="character character-3">❤️</div>
                  <div className="character character-4">🎯</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default HeroSection;