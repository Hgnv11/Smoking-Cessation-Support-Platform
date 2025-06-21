import "./userCoach.css";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { Affix, Button, Card, Divider } from "antd";
import CoachData from "../../config/coachData";
import { RightOutlined } from "@ant-design/icons";

function UserCoach() {
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title">
          <p>Coach Consultation</p>
        </div>
        <Divider className="divider" />
        <div className="wrapper__content">
          <div className="wrapper__content-des">
            <h2>Get Help From Experts</h2>
            <p>
              Getting quit support from an expert, like a health care
              professional or trained quit counselor, can increase your chances
              of success. Ask how they might be able to help you quit.
            </p>
          </div>
          <Divider className="divider" />

          <div className="wrapper__content-coach">
            {CoachData.map((coach) => (
              <Card
                key={coach.user_id}
                hoverable
                className="wrapper__content-coach-card"
              >
                <div className="wrapper__content-coach-card-info">
                  <img
                    src={coach.avatar_url}
                    alt="Coach Avatar"
                    className="wrapper__content-coach-card-info-avatar"
                  />
                  <h2 className="wrapper__content-coach-card-info-name">
                    {coach.gender === "MALE" ? "Mr. " : "Mrs. "}
                    {coach.profile_name}
                  </h2>
                </div>
                <p className="wrapper__content-coach-card-note">{coach.note}</p>
                <Button
                  type="link"
                  className="wrapper__content-coach-card-button"
                >
                  View Schedules and Booking
                  <RightOutlined />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserCoach;
