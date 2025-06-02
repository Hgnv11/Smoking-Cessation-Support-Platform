import React from 'react';
import { Row, Col, Card, Avatar, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Matthew Paul',
      text: 'After 15 years of smoking, I never thought I could quit. This platform connected me with an amazing supportive community made it possible. I\'ve been smoke-free for 8 months now!',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 2,
      name: 'Matthew Paul',
      text: 'After 15 years of smoking, I never thought I could quit. This platform connected me with an amazing supportive community made it possible. I\'ve been smoke-free for 8 months now!',
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 3,
      name: 'Matthew Paul',
      text: 'After 15 years of smoking, I never thought I could quit. This platform connected me with an amazing supportive community made it possible. I\'ve been smoke-free for 8 months now!',
      avatar: '/api/placeholder/40/40',
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <Title level={2} className="section-title">What other users say about QuItLt</Title>
        <Row gutter={[24, 24]}>
          {testimonials.map((testimonial) => (
            <Col xs={24} md={8} key={testimonial.id}>
              <Card className="testimonial-card">
                <Paragraph className="testimonial-text">
                  "{testimonial.text}"
                </Paragraph>
                <div className="testimonial-author">
                  <Avatar src={testimonial.avatar} />
                  <span className="author-name">{testimonial.name}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TestimonialsSection;