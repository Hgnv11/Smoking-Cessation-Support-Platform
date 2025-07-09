import {
  Affix,
  Avatar,
  Button,
  Card,
  message,
  Rate,
  Spin,
  Empty,
  Divider,
  Space,
  Modal,
  Result,
} from "antd";
import "./bookings.css";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";
import {
  CalendarTwoTone,
  ClockCircleTwoTone,
  ExclamationCircleFilled,
  MailTwoTone,
} from "@ant-design/icons";
import api from "../../../../config/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function UserBookings() {
  const user = useSelector((store) => store.user);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("scheduled");
  const navigate = useNavigate();
  const { confirm } = Modal;

  // Function to get time range based on slot number
  const getSlotTimeRange = (slotNumber) => {
    const timeRanges = {
      1: "7:00 AM - 9:30 AM",
      2: "9:30 AM - 12:00 PM",
      3: "13:00 PM - 15:30 PM",
      4: "15:30 PM - 18:00 PM",
    };
    return timeRanges[slotNumber] || "";
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Function to filter bookings by status
  const filterBookings = (status) => {
    setActiveFilter(status);
    const filtered = bookings.filter((booking) => booking.status === status);
    setFilteredBookings(filtered);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/consultations/user");
      setBookings(response.data);
      // Default filter to scheduled
      const scheduledBookings = response.data.filter(
        (booking) => booking.status === "scheduled"
      );
      setFilteredBookings(scheduledBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (consultationId) => {
    try {
      await api.post(`/consultations/${consultationId}/cancel`);
      message.success("Appointment cancelled successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      message.error("Failed to cancel appointment. Please try again.");
    }
  };

  const showCancelConfirm = (consultationId) => {
    confirm({
      title: "Cancel this Appointment?",
      icon: <ExclamationCircleFilled />,
      content:
        "Are you sure you want to cancel this appointment? This action cannot be undone.",
      onOk() {
        handleCancelAppointment(consultationId);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleViewCoach = (profileName) => {
    navigate(`/user-coach/${profileName}`);
  };

  useEffect(() => {
    if (user.hasActive) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user.hasActive]);

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

            {!user.hasActive ? (
              <Result
                title="Upgrade to PRO to unlock Booking a Consultation"
                extra={
                  <Button
                    type="primary"
                    key="console"
                    className="wrapper__profile-bookings-upgrade-btn"
                    onClick={() => navigate("/user-profile/membership")}
                  >
                    See Membership Plans
                  </Button>
                }
              />
            ) : (
              <>
                <div className="wrapper__profile-bookings-categor">
                  <Card
                    hoverable
                    className={`wrapper__profile-bookings-categor-card ${
                      activeFilter === "scheduled" ? "active" : ""
                    }`}
                    onClick={() => filterBookings("scheduled")}
                  >
                    Scheduled
                  </Card>
                  <Card
                    hoverable
                    className={`wrapper__profile-bookings-categor-card ${
                      activeFilter === "completed" ? "active" : ""
                    }`}
                    onClick={() => filterBookings("completed")}
                  >
                    Completed
                  </Card>
                  <Card
                    hoverable
                    className={`wrapper__profile-bookings-categor-card ${
                      activeFilter === "cancelled" ? "active" : ""
                    }`}
                    onClick={() => filterBookings("cancelled")}
                  >
                    Cancelled
                  </Card>
                </div>
                <Divider className="divider" />
                {loading ? (
                  <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <Empty
                    description={`No ${activeFilter} appointments found!`}
                    style={{ margin: "20px 0" }}
                  />
                ) : (
                  filteredBookings.map((booking) => (
                    <Card
                      key={booking.consultationId}
                      className="wrapper__profile-bookings-card"
                    >
                      <p className="wrapper__profile-bookings-card-note">
                        Appointment Details
                      </p>
                      <div className="wrapper__profile-bookings-card-date">
                        <p className="wrapper__profile-bookings-card-date-details">
                          <CalendarTwoTone className="wrapper__profile-bookings-card-date-details-icon" />{" "}
                          {formatDate(booking.slot.slotDate)}
                        </p>
                        <p className="wrapper__profile-bookings-card-date-details">
                          <ClockCircleTwoTone className="wrapper__profile-bookings-card-date-details-icon" />{" "}
                          {getSlotTimeRange(booking.slot.slotNumber)}
                        </p>
                      </div>
                      <div className="wrapper__profile-bookings-card-coach">
                        <div className="wrapper__profile-bookings-card-coach-info">
                          <div className="wrapper__profile-bookings-card-coach-info-des">
                            <Avatar
                              src={booking.slot.mentor.avatarUrl}
                              alt="Coach Avatar"
                              className="wrapper__profile-bookings-card-coach-avatar"
                            />
                            <div>
                              <h2 className="wrapper__profile-bookings-card-coach-info-des-name">
                                {booking.slot.mentor.gender === "male"
                                  ? "Mr. "
                                  : "Mrs. "}
                                {booking.slot.mentor.fullName}
                              </h2>
                              <p className="wrapper__profile-bookings-card-coach-info-des-email">
                                <MailTwoTone className="wrapper__profile-bookings-card-coach-info-des-email-icon" />
                                Email: {booking.slot.mentor.email}
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
                      <div className="wrapper__profile-bookings-card-btn">
                        <Space
                          className="wrapper__profile-bookings-card-btn-detail"
                          wrap
                        >
                          <Button
                            color="default"
                            variant="filled"
                            className="cancel-book"
                            onClick={() =>
                              showCancelConfirm(booking.consultationId)
                            }
                            disabled={booking.status !== "scheduled"}
                          >
                            Cancel Appointment
                          </Button>
                        </Space>

                        <Button
                          color="primary"
                          variant="solid"
                          className="wrapper__profile-bookings-card-btn-detail"
                          onClick={() =>
                            handleViewCoach(booking.slot.mentor.profileName)
                          }
                        >
                          View Coach
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserBookings;
