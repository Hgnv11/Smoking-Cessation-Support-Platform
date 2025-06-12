import React from "react";
import {
  FaUsers,
  FaUserFriends,
  FaChalkboardTeacher,
  FaDollarSign,
  FaChartBar,
} from "react-icons/fa";
import "./OverviewStats.css";

const stats = [
  {
    title: "Total Users",
    value: "1000",
    icon: <FaUsers />,
    note: "Increased by 60%",
  },
  {
    title: "Premium Users",
    value: "7",
    icon: <FaUserFriends />,
    note: "Decreased by 10%",
  },
  {
    title: "Active Coaches",
    value: "15",
    icon: <FaChalkboardTeacher />,
    note: "Increased by 20%",
  },
  {
    title: "Monthly Revenue",
    value: "$2,340",
    icon: <FaDollarSign />,
    note: "Increased by 60%",
  },
  {
    title: "Today's Consultations",
    value: "17",
    icon: <FaChartBar />,
    note: "Increased by 40%",
  },
  {
    title: "New Users (This week)",
    value: "20",
    icon: <FaChartBar />,
    note: "Increased by 40%",
  },
];

const OverviewStats = () => {
  return (
    <div className="overview-stats">
      <h2 className="overview-stats__title">User Overview</h2>
      <div className="overview-stats-grid">
        {stats.map((item, idx) => (
          <div className="overview-stats__card" key={idx}>
            <div className="overview-stats__card-title">{item.title}</div>
            <div className="overview-stats__card-content">
              <span className="overview-stats__icon">{item.icon}</span>
              <span className="overview-stats__value">{item.value}</span>
            </div>
            <div className="overview-stats__note">{item.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewStats;
