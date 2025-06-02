import React from 'react';
import { Row, Col, Card, Button, Typography } from 'antd';
import { Card as AntCard } from 'antd';

const { Title } = Typography;
const { Meta } = AntCard;

const ArticleSection: React.FC = () => {
  const articles = Array(6).fill(null).map((_, index) => ({
    id: index + 1,
    title: 'Benefits of Quitting',
    description: 'After 15 years of smoking, I never thought I could quit. Quitting smoking has been the best decision I\'ve ever made...',
    image: '/api/placeholder/200/150',
  }));

  return (
    <section className="article-section">
      <div className="container">
        <Title level={2} className="section-title">Article & Information</Title>
        <Row gutter={[24, 24]}>
          {articles.map((article) => (
            <Col xs={24} sm={12} lg={8} key={article.id}>
              <Card
                hoverable
                className="article-card"
                cover={
                  <div className="article-image">
                    <img alt={article.title} src={article.image} />
                  </div>
                }
              >
                <Meta
                  title={article.title}
                  description={article.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <div className="view-more-container">
          <Button type="primary" size="large">View More</Button>
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;