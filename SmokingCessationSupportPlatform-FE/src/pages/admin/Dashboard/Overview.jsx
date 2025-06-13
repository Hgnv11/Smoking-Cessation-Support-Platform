import React from "react";
import { Typography } from "antd";
import OverviewStats from "../../../components/admin/OverviewStats/OverviewStats.jsx";
import PerformanceIndex from "../../../components/admin/PerformanceIndex/PerformanceIndex.jsx";
import QuickNotifications from "../../../components/admin/QuickNotifications/QuickNotifications.jsx";
import Sidebar from "../../../components/admin/Sidebar/Sidebar.jsx";
import styles from './Overview.module.css';
import AdminLayout from "../../../components/layout/AdminLayout.jsx";

const { Title } = Typography;

const Overview = () => (
  <AdminLayout title="Overview">
    <div className={styles["overview-page"]}>
      {/* User Overview section */}
      <OverviewStats />

      {/* Performance & Stability Index section */}
      <Title
        level={2}
        style={{ marginTop: "48px", marginBottom: "24px", fontWeight: 600 }}
      >
        Performance & Stability Index
      </Title>
      <PerformanceIndex />

      {/* Quick Notifications section */}
      <QuickNotifications />
    </div>
  </AdminLayout>
);

export default Overview;
