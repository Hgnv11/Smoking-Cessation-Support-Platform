import React, { useState } from "react";
import styles from "./CoachManagement.module.css";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";

const CoachManagement = () => {
  // Mock data for summary cards
  const [statistics] = useState({
    activeCoaches: 5,
    todayConsultations: 7,
    avgRating: 4.8,
  });

  // Mock data for coaches table
  const [coaches] = useState([
    {
      id: "C001",
      name: "Emma Sarah",
      email: "emma.jack@example.com",
      expertise: ["Quit Smoking", "Reduce Stress"],
      rating: 4,
      todayConsults: 2,
      currentCases: 1,
      joinDate: "16/1/2023",
      status: "ACTIVE",
    },
    {
      id: "C002",
      name: "David Sad",
      email: "david.sad@example.com",
      expertise: ["Quit Smoking", "Healthy Lifestyle"],
      rating: 3,
      todayConsults: 4,
      currentCases: 2,
      joinDate: "16/1/2023",
      status: "INACTIVE",
    },
    {
      id: "C003",
      name: "Emma Saraher",
      email: "emma.saraher@example.com",
      expertise: ["Quit Smoking", "Fitness"],
      rating: 5,
      todayConsults: 0,
      currentCases: 1,
      joinDate: "16/1/2023",
      status: "ACTIVE",
    },
    {
      id: "C004",
      name: "John Doe",
      email: "john.doe@example.com",
      expertise: ["Motivation", "Diet"],
      rating: 2,
      todayConsults: 1,
      currentCases: 0,
      joinDate: "20/2/2023",
      status: "ACTIVE",
    },
    {
      id: "C005",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      expertise: ["Mindfulness"],
      rating: 5,
      todayConsults: 3,
      currentCases: 2,
      joinDate: "10/3/2023",
      status: "INACTIVE",
    },
  ]);

  // Hàm render expertise badges
  const renderExpertise = (expertiseArray) => (
    <>
      {expertiseArray.map((exp, i) => (
        <span key={i} className={styles["expertise-badge"]}>
          {exp}
        </span>
      ))}
    </>
  );

  // Hàm render rating stars
  const renderRating = (rating) => (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? `${styles["star"]} ${styles["filled"]}` : styles["star"]}>
          ★
        </span>
      ))}
    </>
  );

  // Hàm render status badge
  const renderStatus = (status) => (
    <span className={`${styles["status-badge"]} ${status === "ACTIVE" ? styles["status-active"] : styles["status-inactive"]}`}>
      {status}
    </span>
  );

  return (
    <AdminLayout title="Coach Management">
      <div className={styles["coach-management-page"]}>
        <h2>Coach Management</h2>
        <div className={styles["summary-cards-row"]}>
          <div className={styles["summary-card"]}>
            <div className={styles["summary-label"]}>Active Coaches</div>
            <div className={styles["summary-value"]}>
              <span className={styles["summary-icon"]}>👥</span>
              {statistics.activeCoaches}
            </div>
          </div>
          <div className={styles["summary-card"]}>
            <div className={styles["summary-label"]}>Today's Consultations</div>
            <div className={styles["summary-value"]}>
              <span className={styles["summary-icon"]}>🗓️</span>
              {statistics.todayConsultations}
            </div>
          </div>
          <div className={styles["summary-card"]}>
            <div className={styles["summary-label"]}>Avg. Rating</div>
            <div className={`${styles["summary-value"]} ${styles["rating-value"]}`}>
              {renderRating(statistics.avgRating)} {statistics.avgRating} / 5
            </div>
          </div>
        </div>
        <div className={styles["list-title"]}>List of coaches</div>
        <div className={styles["search-filter-row"]}>
          <input className={styles["search-input"]} placeholder="Search by name, email, profile name..." />
          <select className={styles["filter-select"]}><option>Filter expertise</option></select>
          <select className={styles["filter-select"]}><option>Filter status</option></select>
          <button className={styles["add-coach-btn"]}>+ Add Coach</button>
        </div>
        <div className={styles["coach-table-wrapper"]}>
          <table className={styles["coach-table"]}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Coach name</th>
                <th>Email</th>
                <th>Expertise</th>
                <th>Rating</th>
                <th>Number of consultations today</th>
                <th>Number of cases currently consulting</th>
                <th>Joining date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((coach) => (
                <tr key={coach.id}>
                  <td>{coach.id}</td>
                  <td>{coach.name}</td>
                  <td>{coach.email}</td>
                  <td>{renderExpertise(coach.expertise)}</td>
                  <td>{renderRating(coach.rating)}</td>
                  <td>{coach.todayConsults}</td>
                  <td>{coach.currentCases}</td>
                  <td>{coach.joinDate}</td>
                  <td>{renderStatus(coach.status)}</td>
                  <td>
                    <div className={styles["action-btns"]}>
                      <button className={styles["edit"]}>✏️ Edit</button>
                      <button className={styles["calendar"]}>🗓️ Calendar</button>
                      {coach.status === "ACTIVE" ? (
                        <button className={styles["deactivate"]}>Deactive</button>
                      ) : (
                        <button className={styles["active-btn"]}>Active</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CoachManagement;
