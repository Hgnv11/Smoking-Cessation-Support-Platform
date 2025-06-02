import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Title, Paragraph } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter className="footer">
      <div className="container">
        <Row gutter={[48, 24]}>
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={3} className="footer-title">QuItLt</Title>
              <Paragraph className="footer-description">
                Your dedicated digital health companion—accessible to mobile and online healthcare specialists.
              </Paragraph>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <div className="footer-section">
              <Title level={5} className="footer-heading">Resource</Title>
              <ul className="footer-links">
                <li><a href="#">Blog</a></li>
                <li><a href="#">Quitting Stories</a></li>
                <li><a href="#">Tips & Articles</a></li>
                <li><a href="#">Research</a></li>
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <div className="footer-section">
              <Title level={5} className="footer-heading">Support</Title>
              <ul className="footer-links">
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Coaching</a></li>
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <div className="footer-section">
              <Title level={5} className="footer-heading">Legal</Title>
              <ul className="footer-links">
                <li><a href="#">Careers</a></li>
                <li><a href="#">News</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-heading">Contact us</Title>
              <Paragraph>📞 +1 (234) 567-890</Paragraph>
              <Paragraph>support@quitlt.com</Paragraph>
            </div>
          </Col>
        </Row>
        <div className="footer-bottom">
          <Row justify="space-between" align="middle">
            <Col>
              <Paragraph className="copyright">Copyright © 2025</Paragraph>
            </Col>
            <Col>
              <Paragraph className="rights">
                All Rights Reserved | <a href="#">Terms and Conditions</a> | <a href="#">Privacy Policy</a>
              </Paragraph>
            </Col>
          </Row>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;