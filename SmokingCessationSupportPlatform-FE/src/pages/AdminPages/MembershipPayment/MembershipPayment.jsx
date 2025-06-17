import React, { useState } from "react";
import styles from "./MembershipPayment.module.css";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";

const MembershipPayment = () => {
  // Mock data cho summary
  const summary = [
    { label: "Payment Is Pending", value: 5, icon: "👥" },
    { label: "Revenue This Month", value: 7, icon: "👥" },
    { label: "Premium Member", value: "$1000", icon: "👥" },
    { label: "Free Users", value: 2, icon: "👤" },
  ];

  // Mock data cho bảng payment
  const [payments] = useState([
    {
      id: "VNP001XYZ",
      package: "Premium monthly",
      userId: "U001",
      email: "an.nguyen@example.com",
      amount: "$50",
      date: "2/1/2024",
      status: "COMPLETED",
    },
    {
      id: "VNP001XYZ",
      package: "Premium monthly",
      userId: "U001",
      email: "an.nguyen@example.com",
      amount: "$50",
      date: "2/1/2024",
      status: "PENDING",
    },
    {
      id: "VNP001XYZ",
      package: "Premium monthly",
      userId: "U001",
      email: "an.nguyen@example.com",
      amount: "$50",
      date: "2/1/2024",
      status: "COMPLETED",
    },
    {
      id: "VNP001XYZ",
      package: "Premium monthly",
      userId: "U001",
      email: "an.nguyen@example.com",
      amount: "$50",
      date: "2/1/2024",
      status: "FAIL",
    },
    {
      id: "VNP001XYZ",
      package: "Premium monthly",
      userId: "U001",
      email: "an.nguyen@example.com",
      amount: "$50",
      date: "2/1/2024",
      status: "FAIL",
    },
  ]);

  // Tab state
  const [activeTab, setActiveTab] = useState("history");

  // Hàm render badge status
  const renderStatus = (status) => {
    if (status === "COMPLETED")
      return <span className={`${styles["status-badge"]} ${styles["status-completed"]}`}>COMPLETED</span>;
    if (status === "PENDING")
      return <span className={`${styles["status-badge"]} ${styles["status-pending"]}`}>PENDING</span>;
    return <span className={`${styles["status-badge"]} ${styles["status-fail"]}`}>FAIL</span>;
  };

  return (
    <AdminLayout title="Membership & Payment">
      <div className={styles["membership-payment-page"]}>
        <h2>Membership & Payment</h2>
        <div className={styles["summary-cards-row"]}>
          {summary.map((item, idx) => (
            <div className={styles["summary-card"]} key={idx}>
              <div className={styles["summary-label"]}>{item.label}</div>
              <div className={styles["summary-value"]}>
                {item.icon} {item.value}
              </div>
            </div>
          ))}
        </div>
        <div className={styles["tabs-row"]}>
          <div
            className={`${styles["tab"]} ${activeTab === "history" ? styles["tab-active"] : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Payment History
          </div>
          <div
            className={`${styles["tab"]} ${activeTab === "plan" ? styles["tab-active"] : ""}`}
            onClick={() => setActiveTab("plan")}
          >
            Payment Plan Management
          </div>
        </div>
        <div className={styles["search-filter-row"]}>
          <select className={styles["filter-select"]}><option>Registration package</option></select>
          <select className={styles["filter-select"]}><option>Account status</option></select>
          <input className={styles["date-input"]} placeholder="Start date" type="date" />
          <input className={styles["date-input"]} placeholder="End date" type="date" />
        </div>
        <div className={styles["payment-table-wrapper"]}>
          <table className={styles["payment-table"]}>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Package name</th>
                <th>User ID</th>
                <th>Email Users</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.id}</td>
                  <td>{p.package}</td>
                  <td>{p.userId}</td>
                  <td>{p.email}</td>
                  <td>{p.amount}</td>
                  <td>{p.date}</td>
                  <td>{renderStatus(p.status)}</td>
                  <td>
                    <button className={`${styles["action-btn"]} ${styles["view"]}`}>👁 View/Process</button>
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

export default MembershipPayment;
