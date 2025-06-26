import { Affix, Avatar, Card, Rate } from "antd";
import "./bookings.css";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";
import {
  CalendarTwoTone,
  ClockCircleTwoTone,
  MailTwoTone,
} from "@ant-design/icons";

function UserBookings() {
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title1">
          <p>My Account</p>
        </div>
        <div className="wrapper__profile">
          <MyAccountNav />
          <div className="wrapper__profile-bookings">
            <h1 className="wrapper__community-posts-title">Bookings</h1>
            <Card className="wrapper__profile-bookings-card">
              <p className="wrapper__profile-bookings-card-note">
                Appointment Details
              </p>
              <div className="wrapper__profile-bookings-card-date">
                <p className="wrapper__profile-bookings-card-date-details">
                  <CalendarTwoTone className="wrapper__profile-bookings-card-date-details-icon" />{" "}
                  Wed, 14 Oct 2025
                </p>
                <p className="wrapper__profile-bookings-card-date-details">
                  <ClockCircleTwoTone className="wrapper__profile-bookings-card-date-details-icon" />{" "}
                  12:00 PM
                </p>
                {/* <p>
                  <strong>Status:</strong> Confirmed
                </p> */}
              </div>
              <div className="wrapper__profile-bookings-card-coach">
                <div className="wrapper__profile-bookings-card-coach-info">
                  <div className="wrapper__profile-bookings-card-coach-info-des">
                    <Avatar
                      src="/images/avatar1.png"
                      alt="Coach Avatar"
                      className="wrapper__profile-bookings-card-coach-avatar"
                    />
                    <div>
                      <h2 className="wrapper__profile-bookings-card-coach-info-des-name">
                        Mr. Vo Hoang Quan
                      </h2>
                      <p className="wrapper__profile-bookings-card-coach-info-des-email">
                        <MailTwoTone className="wrapper__profile-bookings-card-coach-info-des-email-icon" />
                        Email: thienpmse182277@fpt.edu.vn
                      </p>
                    </div>
                  </div>
                  <div className="wrapper__profile-bookings-card-coach-info-rate">
                    <Rate disabled allowHalf defaultValue={4.5} />
                    <p className="wrapper__profile-bookings-card-coach-info-rate-number">
                      Rating 4.5
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="wrapper__profile-bookings-card">
              <p className="wrapper__profile-bookings-card-note">
                Appointment Details
              </p>
              <div className="wrapper__profile-bookings-card-date">
                <p className="wrapper__profile-bookings-card-date-details">
                  <CalendarTwoTone className="wrapper__profile-bookings-card-date-details-icon" />{" "}
                  Wed, 14 Oct 2025
                </p>
                <p className="wrapper__profile-bookings-card-date-details">
                  <ClockCircleTwoTone className="wrapper__profile-bookings-card-date-details-icon" />{" "}
                  12:00 PM
                </p>
                {/* <p>
                  <strong>Status:</strong> Confirmed
                </p> */}
              </div>
              <div className="wrapper__profile-bookings-card-coach">
                <div className="wrapper__profile-bookings-card-coach-info">
                  <div className="wrapper__profile-bookings-card-coach-info-des">
                    <Avatar
                      src="/images/avatar1.png"
                      alt="Coach Avatar"
                      className="wrapper__profile-bookings-card-coach-avatar"
                    />
                    <div>
                      <h2 className="wrapper__profile-bookings-card-coach-info-des-name">
                        Mr. Vo Hoang Quan
                      </h2>
                      <p className="wrapper__profile-bookings-card-coach-info-des-email">
                        <MailTwoTone className="wrapper__profile-bookings-card-coach-info-des-email-icon" />
                        Email: thienpmse182277@fpt.edu.vn
                      </p>
                    </div>
                  </div>
                  <div className="wrapper__profile-bookings-card-coach-info-rate">
                    <Rate disabled allowHalf defaultValue={4.5} />
                    <p className="wrapper__profile-bookings-card-coach-info-rate-number">
                      Rating 4.5
                    </p>
                  </div>
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

export default UserBookings;
