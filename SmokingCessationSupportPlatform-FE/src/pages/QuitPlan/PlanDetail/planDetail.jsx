import "./planDetail.css";
import { Affix, Button, DatePicker, Divider } from "antd";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import {
  CalendarTwoTone,
  CheckCircleOutlined,
  CrownOutlined,
  DollarOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import api from "../../../config/axios";
import { useSelector } from "react-redux";
import {
  Activity,
  AlertTriangle,
  ClipboardCheck,
  Heart,
  Wind,
} from "lucide-react";

function PlanDetail() {
  const user = useSelector((store) => store.user);
  const dateFormat = "DD/MM/YYYY";
  const [userProfile, setUserProfile] = useState(null);
  const [savingData, setSavingData] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [userReasons, setUserReasons] = useState([]);
  const [userTriggers, setUserTriggers] = useState([]);
  const [userStrategies, setUserStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [deleting, setDeleting] = useState(false);

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

    const fetchHealthMetrics = async () => {
      try {
        const response = await api.get(`/health/metrics/${user.userId}`);
        setHealthMetrics(response.data);
      } catch (error) {
        console.error("Error fetching health metrics:", error);
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
    fetchHealthMetrics();
    fetchUserReasons();
    fetchUserTriggers();
    fetchUserStrategies();
  }, [user.userId]);

  // const handleDeletePlan = async () => {
  //   setDeleting(true);
  //   try {
  //     if (userProfile?.eventId) {
  //       await api.delete(`/smoking-events/${userProfile.eventId}`);
  //     }

  //     await api.delete(`/reasons/delete/${user.userId}`);

  //     await api.delete(`/user-triggers/delete/${user.userId}`);

  //     await api.delete(`/user-strategies/delete/${user.userId}`);

  //     message.success("Plan deleted successfully!");

  //     setUserProfile(null);
  //     setUserReasons([]);
  //     setUserTriggers([]);
  //     setUserStrategies([]);
  //   } catch (error) {
  //     console.error("Error deleting plan:", error);
  //     message.error("Failed to delete plan. Please try again.");
  //   } finally {
  //     setDeleting(false);
  //   }
  // };

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
            <div className="wrapper__content-detail-saving-container">
              <div className="wrapper__content-detail-saving-item">
                <p>
                  <CalendarTwoTone className="wrapper__content-detail-saving-title-icon" />
                  <span className="wrapper__content-detail-saving-period">
                    1 week smoke-free
                  </span>
                  <span className="wrapper__content-detail-saving-value">
                    ${savingData?.perWeek?.toFixed(2) || "0.00"}
                  </span>
                </p>
              </div>
              <div className="wrapper__content-detail-saving-item">
                <p>
                  <CalendarTwoTone className="wrapper__content-detail-saving-title-icon" />
                  <span className="wrapper__content-detail-saving-period">
                    1 month smoke-free
                  </span>
                  <span className="wrapper__content-detail-saving-value">
                    ${savingData?.perMonth?.toFixed(2) || "0.00"}
                  </span>
                </p>
              </div>
              <div className="wrapper__content-detail-saving-item">
                <p>
                  <CalendarTwoTone className="wrapper__content-detail-saving-title-icon" />
                  <span className="wrapper__content-detail-saving-period">
                    1 year smoke-free
                  </span>
                  <span className="wrapper__content-detail-saving-value">
                    ${savingData?.perYear?.toFixed(2) || "0.00"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="wrapper__content-detail">
            <h2 className="wrapper__content-detail-title">Overall Progress</h2>
            <p className="wrapper__content-detail-des">
              This is a summary of your progress so far. It shows how far you've
              come and what you still need to do to stay on track.
            </p>
            <div className="wrapper__content-detail-progress">
              <div className="wrapper__content-detail-progress-container">
                <div className="wrapper__content-detail-progress-item">
                  <p>
                    <FireOutlined className="wrapper__content-detail-progress-item-fire" />
                    <span className="wrapper__content-detail-progress-item-number">
                      {savingData?.cigarettesAvoided || 0}
                    </span>
                    cigarettes avoided
                  </p>
                </div>
                <div className="wrapper__content-detail-progress-item">
                  <p>
                    <DollarOutlined className="wrapper__content-detail-progress-item-money" />
                    <span className="wrapper__content-detail-progress-item-number">
                      {savingData?.moneySaved || 0}
                    </span>
                    dollars saved
                  </p>
                </div>
              </div>
              <div className="wrapper__content-detail-progress-btn-container">
                <Button
                  color="danger"
                  variant="filled"
                  className="wrapper__content-detail-progress-btn"
                >
                  I Have Smoked Today!
                </Button>
              </div>
            </div>
          </div>

          <div className="wrapper__content-detail">
            <h2 className="wrapper__content-detail-title">Health Metrics</h2>
            <p className="wrapper__content-detail-des">
              Your health is improving as you continue your smoke-free journey.
              These metrics show the positive impact on your body.
            </p>
            <div className="wrapper__content-detail-health">
              <div className="wrapper__content-detail-health-row">
                <div className="wrapper__content-detail-progress-item1">
                  <div className="wrapper__content-detail-progress-item1-title">
                    <Heart className="wrapper__content-detail-progress-item1-blood" />
                    Blood Pressure
                    <div className="wrapper__content-detail-progress-item1-number">
                      <h2>
                        {healthMetrics?.bpSystolic || 0}/
                        {healthMetrics?.bpDiastolic || 0}
                      </h2>
                      <h3>mmHg</h3>
                    </div>
                  </div>
                </div>
                <div className="wrapper__content-detail-progress-item1">
                  <div className="wrapper__content-detail-progress-item1-title">
                    <Activity className="wrapper__content-detail-progress-item1-heart" />
                    Heart Rate
                    <div className="wrapper__content-detail-progress-item1-number">
                      <h2>{healthMetrics?.heartRate || 0}</h2>
                      <h3>bpm</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="wrapper__content-detail-health-row">
                <div className="wrapper__content-detail-progress-item1">
                  <div className="wrapper__content-detail-progress-item1-title">
                    <Wind className="wrapper__content-detail-progress-item1-oxy" />
                    Oxygen Saturation
                    <div className="wrapper__content-detail-progress-item1-number">
                      <h2>{healthMetrics?.spo2 || 0}%</h2>
                      <h3>SpO2</h3>
                    </div>
                  </div>
                </div>
                <div className="wrapper__content-detail-progress-item1">
                  <div className="wrapper__content-detail-progress-item1-title">
                    <AlertTriangle className="wrapper__content-detail-progress-item1-co" />
                    CO Level
                    <div className="wrapper__content-detail-progress-item1-number">
                      <h2>{healthMetrics?.cohb || 0}%</h2>
                      <h3>COHb</h3>
                    </div>
                  </div>
                </div>
              </div>
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
        <div className="completed-wrapper">
          <Button
            className="completed-wrapper-btn"
            color="cyan"
            variant="solid"
          >
            <ClipboardCheck /> I Have Completed My Quit Plan
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PlanDetail;
