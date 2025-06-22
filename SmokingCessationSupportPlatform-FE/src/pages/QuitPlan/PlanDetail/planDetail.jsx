import "./planDetail.css";
import { Affix, Col, DatePicker, Divider, Row } from "antd";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import {
  CalendarOutlined,
  CrownOutlined,
  DollarOutlined,
  FireOutlined,
} from "@ant-design/icons";

function PlanDetail() {
  const dateFormat = "DD/MM/YYYY";

  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title">
          <p>My Quit Plan</p>
        </div>
        <Divider className="divider" />
        <div className="wrapper__content">
          <div className="wrapper__content-detail">
            <h2 className="wrapper__content-detail-title">My Quit Day</h2>
            <p className="wrapper__content-detail-des">
              Use this time before your quit day to review your quit plan and
              take steps to get ready. Quitting can be easier when you are ready
              to face any challenges that come your way.
            </p>
            <DatePicker
              disabled
              variant="filled"
              className="wrapper__content-detail-date"
              format={dateFormat}
            />
          </div>

          <div className="wrapper__content-detail">
            <h2 className="wrapper__content-detail-title">My Saving</h2>
            <p className="wrapper__content-detail-des">
              We calculated what you'll save by quitting. Take a moment to think
              about the specific things you'll do with the extra money.
            </p>
            <div className="wrapper__content-detail-saving">
              <p className="wrapper__content-detail-saving-title">
                <CalendarOutlined className="wrapper__content-detail-saving-title-icon" />
                1 week smoke-free :
                <span className="wrapper__content-detail-saving-value">
                  $50.00
                </span>
              </p>
            </div>
            <div className="wrapper__content-detail-saving">
              <p className="wrapper__content-detail-saving-title">
                <CalendarOutlined className="wrapper__content-detail-saving-title-icon" />
                1 month smoke-free :
                <span className="wrapper__content-detail-saving-value">
                  $50.00
                </span>
              </p>
            </div>

            <div className="wrapper__content-detail-saving">
              <p className="wrapper__content-detail-saving-title">
                <CalendarOutlined className="wrapper__content-detail-saving-title-icon" />
                1 year smoke-free :
                <span className="wrapper__content-detail-saving-value">
                  $50.00
                </span>
              </p>
            </div>
          </div>

          <div className="wrapper__content-detail">
            <h2 className="wrapper__content-detail-title">Overall Progress</h2>
            <p className="wrapper__content-detail-des">
              This is a summary of your progress so far. It shows how far you've
              come and what you still need to do to stay on track.
            </p>
            <div className="wrapper__content-detail-progress">
              <Row
                gutter={[8, 16]}
                className="wrapper__content-detail-progress-item"
              >
                <Col span={12}>
                  <p>
                    <FireOutlined className="wrapper__content-detail-progress-item-fire" />
                    <span className="wrapper__content-detail-progress-item-number">
                      20
                    </span>
                    cigarettes avoided
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <FireOutlined className="wrapper__content-detail-progress-item-fire" />
                    <span className="wrapper__content-detail-progress-item-number">
                      20
                    </span>
                    won back
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <DollarOutlined className="wrapper__content-detail-progress-item-money" />
                    <span className="wrapper__content-detail-progress-item-number">
                      20
                    </span>
                    dollars saved
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <CrownOutlined className="wrapper__content-detail-progress-item-badge" />
                    <span className="wrapper__content-detail-progress-item-number">
                      20
                    </span>
                    badges achieved
                  </p>
                </Col>
              </Row>
            </div>
          </div>

          <div className="wrapper__content-detail">
            <h2 className="wrapper__content-detail-title">
              Remind Yourself Why You Want To Quit
            </h2>
            <p className="wrapper__content-detail-des">
              When quitting feels tough, think back on these reasons why
              quitting smoking is important to you.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PlanDetail;
