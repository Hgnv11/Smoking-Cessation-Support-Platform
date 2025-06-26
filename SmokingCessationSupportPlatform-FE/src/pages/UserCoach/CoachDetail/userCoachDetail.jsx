import "./userCoachDetail.css";
import { Affix, Avatar, Button, Card, Divider, Rate } from "antd";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import { MailTwoTone } from "@ant-design/icons";

function UserCoachDetail() {
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title">
          <p>Schedules and Booking</p>
        </div>
        <Divider className="divider" />
        <div className="wrapper__coach">
          <div className="wrapper__coach-info">
            <div className="wrapper__coach-info-des">
              <Avatar
                src="/images/avatar1.png"
                alt="Coach Avatar"
                className="wrapper__coach-info-des-avt"
              />
              <div>
                <h2 className="wrapper__coach-info-des-name">
                  Mr. Vo Hoang Quan
                </h2>
                <p className="wrapper__coach-info-des-note">
                  <MailTwoTone className="wrapper__coach-info-des-note-mail" />
                  Email: thienpmse182277@fpt.edu.vn
                </p>
              </div>
            </div>
            <div className="wrapper__coach-info-rate">
              <Rate disabled allowHalf defaultValue={4.5} />
              <p className="wrapper__coach-info-rate-number">Rating 4.5</p>
            </div>
          </div>

          <div className="wrapper__coach-note">
            <h2 className="wrapper__coach-title">About Me</h2>
            <p className="wrapper__coach-title-des">
              Former counselor at Ho Chi Minh Smoking Cessation Center, uses a
              calm and supportive approach.
            </p>
          </div>

          <div className="wrapper__coach-schedule">
            <h2 className="wrapper__coach-title">Working Schedules</h2>
            <p className="wrapper__coach-title-des">
              Select a time slot to book a session with Mr. Vo Hoang Quan.
              Available times are listed below for each date.
            </p>
            <div className="wrapper__coach-schedule-detail">
              <p className="wrapper__coach-schedule-detail-date">
                Tuesday, June 6, 2025
              </p>
              <div className="wrapper__coach-schedule-detail-card">
                <Card
                  hoverable
                  className="wrapper__coach-schedule-detail-card-time"
                >
                  9:00 AM
                </Card>
                <Card
                  hoverable
                  className="wrapper__coach-schedule-detail-card-time"
                >
                  12:00 AM
                </Card>
                <Card
                  hoverable
                  className="wrapper__coach-schedule-detail-card-time"
                >
                  14:00 PM
                </Card>
                <Card
                  hoverable
                  className="wrapper__coach-schedule-detail-card-time"
                >
                  16:00 PM
                </Card>
              </div>
            </div>
            <div className="wrapper__coach-schedule-detail">
              <p className="wrapper__coach-schedule-detail-date">
                Tuesday, June 7, 2025
              </p>
              <div className="wrapper__coach-schedule-detail-card">
                <Card
                  hoverable
                  className="wrapper__coach-schedule-detail-card-time"
                >
                  9:00 AM
                </Card>
                <Card
                  hoverable
                  className="wrapper__coach-schedule-detail-card-time"
                >
                  14:00 PM
                </Card>
                <Card
                  hoverable
                  className="wrapper__coach-schedule-detail-card-time"
                >
                  16:00 PM
                </Card>
              </div>
            </div>
            <div className="wrapper__coach-schedule-booking">
              <Button
                color="primary"
                variant="solid"
                className="wrapper__coach-schedule-booking-btn"
              >
                Book an Appointment
              </Button>
            </div>
          </div>

          <div className="wrapper__coach-feedback">
            <h2 className="wrapper__coach-title">Feedback</h2>
            <p className="wrapper__coach-title-des">
              Here are some feedback from users who have worked with Mr. Vo
              Hoang Quan.
            </p>
            <Card className="wrapper__coach-feedback-card">
              <div className="wrapper__coach-feedback-card-item">
                <Avatar
                  src="/images/avatar2.png"
                  alt="User Avatar"
                  className="wrapper__coach-feedback-card-item-avt"
                />
                <div className="wrapper__coach-feedback-card-item-content">
                  <h3 className="wrapper__coach-feedback-card-item-content-name">
                    Nguyen Van A
                  </h3>
                  <Rate disabled allowHalf defaultValue={4.5} />
                  <p className="wrapper__coach-feedback-item-content-note">
                    Mr. Vo Hoang Quan is very supportive and helpful. He helped
                    me a lot in my quitting journey.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="wrapper__coach-feedback-card">
              <div className="wrapper__coach-feedback-card-item">
                <Avatar
                  src="/images/avatar1.png"
                  alt="User Avatar"
                  className="wrapper__coach-feedback-card-item-avt"
                />
                <div className="wrapper__coach-feedback-card-item-content">
                  <h3 className="wrapper__coach-feedback-card-item-content-name">
                    Nguyen Van B
                  </h3>
                  <Rate disabled allowHalf defaultValue={4.5} />
                  <p className="wrapper__coach-feedback-item-content-note">
                    Mr. Vo Hoang Quan is very supportive and helpful. He helped
                    me a lot in my quitting journey. He helped me a lot in my
                    quitting journey
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserCoachDetail;
