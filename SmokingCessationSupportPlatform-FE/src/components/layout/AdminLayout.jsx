import React from "react";
import Sidebar from "../../components/admin/Sidebar/Sidebar.jsx";
import { Layout, Typography, Breadcrumb } from "antd";
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
          <Breadcrumb className={styles["admin-breadcrumb"]}>
            <Breadcrumb.Item>Dashboards</Breadcrumb.Item>
            {title && <Breadcrumb.Item>{title}</Breadcrumb.Item>}
          </Breadcrumb>
        </Header>
        <Content className={styles["admin-content"]}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 