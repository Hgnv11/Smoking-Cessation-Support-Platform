import React from "react";
import Sidebar from "../../components/admin/Sidebar/Sidebar.jsx";
import { Layout, Typography } from "antd";
import styles from "./AdminLayout.module.css";

const { Sider, Header, Content } = Layout;

const AdminLayout = ({ children, title }) => {
  return (
    <Layout className={styles["admin-layout-root"]}>
      <Sider width={240} className={styles["admin-sider"]}>
        <Sidebar />
      </Sider>
      <Layout className={styles["admin-main"]}>
        <Header className={styles["admin-header"]}>
          <Typography.Title level={3} className={styles["admin-title"]}>
            {title || "Admin Dashboard"}
          </Typography.Title>
        </Header>
        <Content className={styles["admin-content"]}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 