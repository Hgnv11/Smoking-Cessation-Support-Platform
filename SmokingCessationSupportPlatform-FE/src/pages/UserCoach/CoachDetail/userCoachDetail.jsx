import "./userCoachDetail.css";
import {
  Affix,
  Avatar,
  Button,
  Card,
  Divider,
  Empty,
  message,
  Rate,
  Spin,
} from "antd";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import { MailTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useParams } from "react-router-dom";

function UserCoachDetail() {
  const { profileName } = useParams();
  const [coach, setCoach] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchCoachData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profile/by-name/${profileName}`);
      setCoach(response.data);

      // Fetch slots after getting coach data
      if (response.data && response.data.userId) {
        await fetchSlots(response.data.userId);
      }
    } catch (error) {
      console.error("Error fetching coach data:", error);
      message.error("Failed to fetch coach profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (mentorId) => {
    try {
      setSlotsLoading(true);
      const response = await api.get(`/consultations/mentor/${mentorId}/slots`);
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
      message.error("Failed to fetch available slots. Please try again later.");
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (profileName) {
      fetchCoachData();
    }
  }, [profileName]);

  if (loading) {
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
          <div style={{ textAlign: "center", padding: "100px" }}>
            <Spin size="large" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!coach) {
    return (
      <>
        <Affix offsetTop={0}>
          <Header />
        </Affix>
        <Empty description="No Mentors Available" />
        <Footer />
      </>
    );
  }

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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Group slots by date
  const groupSlotsByDate = (slots) => {
    const grouped = {};
    slots.forEach((slot) => {
      const date = slot.slotDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate(slots);

  const handleSlotSelect = (slotId) => {
    setSelectedSlots((prev) => {
      if (prev.includes(slotId)) {
        // If slot is already selected, remove it
        return prev.filter((id) => id !== slotId);
      } else {
        // If slot is not selected, add it
        return [...prev, slotId];
      }
    });
  };

  const isSlotSelected = (slotId) => {
    return selectedSlots.includes(slotId);
  };

  const handleBookAppointment = async () => {
    if (selectedSlots.length === 0) {
      message.warning("Please select at least one slot");
      return;
    }

    try {
      setBookingLoading(true);

      // Get selected slot details
      const selectedSlotDetails = slots.filter((slot) =>
        selectedSlots.includes(slot.slotId)
      );

      // Create booking requests for each selected slot
      const bookingPromises = selectedSlotDetails.map((slot) =>
        api.post(
          "/consultations/book",
          {},
          {
            params: {
              mentorId: coach.userId,
              slotDate: slot.slotDate,
              slotNumber: slot.slotNumber,
            },
          }
        )
      );

      // Wait for all bookings to complete
      await Promise.all(bookingPromises);

      message.success(
        `Successfully booked ${selectedSlots.length} appointment${
          selectedSlots.length > 1 ? "s" : ""
        }!`
      );

      // Clear selected slots
      setSelectedSlots([]);

      await fetchSlots(coach.userId);
    } catch (error) {
      console.error("Error booking appointments:", error);
      message.error("Failed to book appointment(s). Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

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
                src={coach.avatarUrl}
                alt="Coach Avatar"
                className="wrapper__coach-info-des-avt"
              />
              <div>
                <h2 className="wrapper__coach-info-des-name">
                  {coach.gender === "male" ? "Mr. " : "Mrs. "}
                  {coach.fullName}
                </h2>
                <p className="wrapper__coach-info-des-note">
                  <MailTwoTone className="wrapper__coach-info-des-note-mail" />
                  Email: {coach.email}
                </p>
              </div>
            </div>
          </div>

          <div className="wrapper__coach-note">
            <h2 className="wrapper__coach-title">About Me</h2>
            <p className="wrapper__coach-title-des">{coach.note}</p>
          </div>

          <div className="wrapper__coach-schedule">
            <h2 className="wrapper__coach-title">Working Schedules</h2>
            <p className="wrapper__coach-title-des">
              Select a time slot to book a session with{" "}
              {coach.gender === "male" ? "Mr. " : "Mrs. "}
              {coach.fullName}. Available times are listed below for each date.
            </p>

            {slotsLoading ? (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
              </div>
            ) : Object.keys(groupedSlots).length === 0 ? (
              <Empty
                description="No Slots Available!"
                style={{ margin: "50px 0" }}
              />
            ) : (
              Object.entries(groupedSlots).map(([date, dateSlots]) => (
                <div key={date} className="wrapper__coach-schedule-detail">
                  <p className="wrapper__coach-schedule-detail-date">
                    {formatDate(date)}
                  </p>
                  <div className="wrapper__coach-schedule-detail-card">
                    {dateSlots
                      .filter((slot) => !slot.booked)
                      .sort((a, b) => a.slotNumber - b.slotNumber)
                      .map((slot) => (
                        <Card
                          key={slot.slotId}
                          hoverable
                          className={`wrapper__coach-schedule-detail-card-time ${
                            isSlotSelected(slot.slotId) ? "selected" : ""
                          }`}
                          onClick={() => handleSlotSelect(slot.slotId)}
                        >
                          <p className="wrapper__coach-schedule-detail-card-time-slot">
                            Slot {slot.slotNumber}
                          </p>
                          <p className="wrapper__coach-schedule-detail-card-time-detail">
                            {getSlotTimeRange(slot.slotNumber)}
                          </p>
                        </Card>
                      ))}
                  </div>
                </div>
              ))
            )}

            <div className="wrapper__coach-schedule-booking">
              <Button
                color="primary"
                variant="solid"
                className="wrapper__coach-schedule-booking-btn"
                disabled={selectedSlots.length === 0 || bookingLoading}
                loading={bookingLoading}
                onClick={handleBookAppointment}
              >
                {bookingLoading
                  ? "Booking..."
                  : `Book Appointment${selectedSlots.length > 1 ? "s" : ""} (${
                      selectedSlots.length
                    })`}
              </Button>
            </div>
          </div>

          <div className="wrapper__coach-feedback">
            <h2 className="wrapper__coach-title">Feedback</h2>
            <p className="wrapper__coach-title-des">
              Here are some feedback from users who have worked with{" "}
              {coach.gender === "male" ? "Mr. " : "Mrs. "}
              {coach.fullName}.
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
                    {coach.gender === "male" ? "Mr. " : "Mrs. "}
                    {coach.fullName} is very supportive and helpful. He helped
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
                    {coach.gender === "male" ? "Mr. " : "Mrs. "}
                    {coach.fullName} is very supportive and helpful. He helped
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
