import "./planDetail.css";
import { Affix, Button, Col, DatePicker, Divider, Row } from "antd";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import {
  CalendarTwoTone,
  CrownOutlined,
  DollarOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import api from "../../../config/axios";
import { useSelector } from "react-redux";

function PlanDetail() {
  const user = useSelector((store) => store.user);
  const dateFormat = "DD/MM/YYYY";
  const [userProfile, setUserProfile] = useState(null);
  const [savingData, setSavingData] = useState(null);
  const [userReasons, setUserReasons] = useState([]);
  const [userTriggers, setUserTriggers] = useState([]);
  const [userStrategies, setUserStrategies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/user-smoking-profile/my");
        if (response.data && response.data.length > 0) {
          setUserProfile(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavingData = async () => {
      try {
        const response = await api.get("/user-smoking-profile/calculate");
        setSavingData(response.data);
      } catch (error) {
        console.error("Error fetching saving data:", error);
      }
    };

    const fetchUserReasons = async () => {
      try {
        const response = await api.get(`/reasons/user/${user.userId}`);
        setUserReasons(response.data);
      } catch (error) {
        console.error("Error fetching user reasons:", error);
      }
    };

    const fetchUserTriggers = async () => {
      try {
        const response = await api.get("/user-triggers/my");
        if (response.data && response.data.length > 0) {
          setUserTriggers(response.data[0].triggerCategories);
        }
      } catch (error) {
        console.error("Error fetching user triggers:", error);
      }
    };

    const fetchUserStrategies = async () => {
      try {
        const response = await api.get("/user-strategies/my");
        if (response.data && response.data.length > 0) {
          setUserStrategies(response.data[0].strategyCategories);
        }
      } catch (error) {
        console.error("Error fetching user strategies:", error);
      }
    };

    fetchUserProfile();
    fetchSavingData();
    fetchUserReasons();
    fetchUserTriggers();
    fetchUserStrategies();
  }, [user.userId]);

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
              size="large"
              disabled
              variant="filled"
              className="wrapper__content-detail-date"
              format={dateFormat}
              value={userProfile?.quitDate ? dayjs(userProfile.quitDate) : null}
              loading={loading}
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
                <CalendarTwoTone className="wrapper__content-detail-saving-title-icon" />
                1 week smoke-free :
                <span className="wrapper__content-detail-saving-value">
                  ${savingData?.perWeek?.toFixed(2) || "0.00"}
                </span>
              </p>
            </div>
            <div className="wrapper__content-detail-saving">
              <p className="wrapper__content-detail-saving-title">
                <CalendarTwoTone className="wrapper__content-detail-saving-title-icon" />
                1 month smoke-free :
                <span className="wrapper__content-detail-saving-value">
                  ${savingData?.perMonth?.toFixed(2) || "0.00"}
                </span>
              </p>
            </div>

            <div className="wrapper__content-detail-saving">
              <p className="wrapper__content-detail-saving-title">
                <CalendarTwoTone className="wrapper__content-detail-saving-title-icon" />
                1 year smoke-free :
                <span className="wrapper__content-detail-saving-value">
                  ${savingData?.perYear?.toFixed(2) || "0.00"}
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
              <Button
                color="danger"
                variant="filled"
                className="wrapper__content-detail-progress-btn"
              >
                I Have Smoked Today!
              </Button>
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
            <h3>My reasons :</h3>
            <ul className="wrapper__content-detail-reasons">
              {userReasons.map((reason) => (
                <li key={reason.reasonId}>- {reason.reasonText}</li>
              ))}
            </ul>
          </div>

          <div className="wrapper__content-detail">
            <h2 className="wrapper__content-detail-title">
              Understand Your Triggers
            </h2>
            <p className="wrapper__content-detail-des">
              Over time, you've built up patterns and routines around smoking -
              especially if you smoke during many different activities or
              frequently throughout the day. Knowing your smoking behaviors -
              like when and where you typically smoke - may help you prepare for
              situations that make you want to smoke and avoid them.
            </p>
            <h3>My triggers :</h3>
            {userTriggers.map((category) => (
              <div
                key={category.categoryId}
                className="wrapper__content-detail-triggers"
              >
                <h3 className="wrapper__content-detail-triggers-title">
                  {category.name}
                </h3>
                <ul className="wrapper__content-detail-triggers-list">
                  {category.triggers.map((trigger) => (
                    <li key={trigger.triggerId}>- {trigger.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="wrapper__content-detail">
            <h2 className="wrapper__content-detail-title">
              Plan for Your Cravings
            </h2>
            <p className="wrapper__content-detail-des">
              Cravings are temporary and will fade over time the longer you stay
              quit. When a craving hits, find something else to do instead of
              smoking. It will pass. The important thing is to keep trying
              different things until you find what works for you
            </p>
            <h3>My craving strategies :</h3>
            {userStrategies.map((category) => (
              <div
                key={category.categoryId}
                className="wrapper__content-detail-triggers"
              >
                <h3 className="wrapper__content-detail-triggers-title">
                  {category.name}
                </h3>
                <ul className="wrapper__content-detail-triggers-list">
                  {category.strategies.map((strategy) => (
                    <li key={strategy.strategyId}>- {strategy.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PlanDetail;
