import styles from "./UserManagement.module.css";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";
import ReusableTable from "../../../components/admin/ReusableTable/ReusableTable.jsx";
import {
  Modal,
  Tabs,
  Form,
  Select,
  Tag,
  List,
  Descriptions,
  Button,
} from "antd";
import { useState } from "react";

const UserManagement = () => {
  const [users] = useState([
    {
      id: "U001",
      name: "Emma Sarah",
      author: "emma.jack@example.com",
      profile: "Emma158",
      role: "Customer",
      membership: "Premium",
      joinDate: "16/1/2023",
      lastActivity: "2024-10-15",
      status: "locked",
    },
    {
      id: "U002",
      name: "David Sad",
      author: "david.sad@example.com",
      profile: "David_S",
      role: "Coach",
      membership: "Free",
      joinDate: "01/2/2023",
      lastActivity: "2024-10-14",
      status: "active",
    },
    {
      id: "U003",
      name: "John Doe",
      author: "john.doe@example.com",
      profile: "JDoe",
      role: "Customer",
      membership: "Premium",
      joinDate: "05/3/2023",
      lastActivity: "2024-10-16",
      status: "active",
    },
    {
      id: "U004",
      name: "Jane Smith",
      author: "jane.smith@example.com",
      profile: "JaneS",
      role: "Coach",
      membership: "Free",
      joinDate: "10/4/2023",
      lastActivity: "2024-10-13",
      status: "locked",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedMembership, setSelectedMembership] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const mockSubscriptionHistory = [
    { plan: "Premium", startDate: "2024-01-01", endDate: "2024-02-01" },
    { plan: "Free", startDate: "2023-12-01", endDate: "2023-12-31" },
  ];

  const mockSmokingProfile = {
    status: "Active",
    initialDailyCigarettes: 20,
    quitStartDate: "2024-01-15",
  };

  const mockGoals = [
    {
      goal: "Reduce to 10 cigarettes per day",
      targetDate: "2024-02-15",
      status: "In Progress",
    },
    {
      goal: "Quit smoking completely",
      targetDate: "2024-03-01",
      status: "Not Started",
    },
  ];

  const mockProgress = {
    daysSmokeFree: 15,
    moneySaved: "$150",
  };

  const mockBadges = ["First Week", "One Month", "Money Saver"];

  const mockConsultations = [
    { coachName: "Dr. Smith", date: "2024-01-20", topic: "Initial Assessment" },
    { coachName: "Dr. Johnson", date: "2024-01-27", topic: "Progress Review" },
  ];

  const membershipOptions = [
    { value: "", label: "Filter membership packages" },
    { value: "Premium", label: "Premium" },
    { value: "Free", label: "Free" },
  ];

  const statusOptions = [
    { value: "", label: "Filter account status" },
    { value: "active", label: "Active" },
    { value: "locked", label: "Locked" },
  ];

  const roleOptions = [
    { value: "", label: "Filter roles" },
    { value: "Customer", label: "Customer" },
    { value: "Coach", label: "Coach" },
  ];

  const columns = [
    { title: "User ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Author", dataIndex: "author" },
    { title: "Profile name", dataIndex: "profile" },
    {
      title: "Role",
      dataIndex: "role",
      render: (value) => (
        <span
          className={
            value === "Coach" ? styles["role-coach"] : styles["role-customer"]
          }
        >
          {value}
        </span>
      ),
    },
    {
      title: "Membership package",
      dataIndex: "membership",
      render: (value) => (
        <span
          className={
            value === "Premium"
              ? styles["membership-premium"]
              : styles["membership-free"]
          }
        >
          {value}
        </span>
      ),
    },
    { title: "Joining date", dataIndex: "joinDate" },
    { title: "Last activity", dataIndex: "lastActivity" },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, row) => (
        <div className={styles["action-btns"]}>
          <button className={styles["edit-btn"]}>Edit</button>
          <button
            className={styles["details-btn"]}
            onClick={() => {
              /* handleSeeDetails(row) */
            }}
          >
            See Details
          </button>
          <button
            className={styles["delete-btn"]}
            onClick={() => {
              /* handleDeleteUser(row.id) */
            }}
          >
            Delete
          </button>
          {row.status === "locked" ? (
            <button className={styles["lock-btn"]}>Account Lock</button>
          ) : (
            <button className={styles["unlock-btn"]}>Unlock account</button>
          )}
        </div>
      ),
    },
  ];

  const filterConfig = [
    {
      key: "search",
      type: "text",
      placeholder: "Search by name, email, profile name...",
    },
    {
      key: "membership",
      type: "select",
      options: membershipOptions,
    },
    {
      key: "status",
      type: "select",
      options: statusOptions,
    },
    {
      key: "role",
      type: "select",
      options: roleOptions,
    },
  ];

  return (
    <AdminLayout title="User Management">
      <div className={styles["user-management-page"]}>
        <h2>User Management</h2>
        <div className={styles["search-filter-header"]}>Search and Filter</div>
        <div className={styles["search-filter-row"]}>
          <input
            className={styles["search-input"]}
            placeholder="Search by name, email, profile name..."
          />
          <Select
            className={styles["filter-select"]}
            onChange={(value) => setSelectedMembership(value)}
            value={selectedMembership}
            options={membershipOptions}
          />
          <Select
            className={styles["filter-select"]}
            onChange={(value) => setSelectedStatus(value)}
            value={selectedStatus}
            options={statusOptions}
          />
          <Select
            className={styles["filter-select"]}
            onChange={(value) => setSelectedRole(value)}
            value={selectedRole}
            options={roleOptions}
          />
          <button className={styles["add-user-btn"]}>+ Add user</button>
        </div>

        <div className={styles["user-table-wrapper"]}>
          <ReusableTable columns={columns} data={users} />
        </div>

        <Modal
          title={
            selectedUser ? `User Details: ${selectedUser.name}` : "User Details"
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={800}
        >
          <Tabs
            defaultActiveKey="membership"
            items={[
              {
                key: "membership",
                label: "Membership Information",
                children: (
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <h3>Current Membership</h3>
                      <Tag
                        color={
                          selectedUser?.membership === "Premium"
                            ? "gold"
                            : "default"
                        }
                      >
                        {selectedUser?.membership}
                      </Tag>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <h3>Subscription History</h3>
                      <List
                        dataSource={mockSubscriptionHistory}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={item.plan}
                              description={`${item.startDate} to ${item.endDate}`}
                            />
                          </List.Item>
                        )}
                      />
                    </div>

                    <div>
                      <h3>Update Membership Plan</h3>
                      <Form
                        form={form}
                        onFinish={() => {
                          /* handleUpdatePlan */
                        }}
                        layout="vertical"
                      >
                        <Form.Item
                          name="newPlan"
                          label="New Plan"
                          rules={[
                            { required: true, message: "Please select a plan" },
                          ]}
                        >
                          <Select>
                            <Select.Option value="Premium">
                              Premium
                            </Select.Option>
                            <Select.Option value="Free">Free</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Update Plan
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                ),
              },
              {
                key: "smoking",
                label: "Smoking Cessation Info",
                children: (
                  <div>
                    <Descriptions title="Smoking Profile" bordered>
                      <Descriptions.Item label="Status">
                        {mockSmokingProfile.status}
                      </Descriptions.Item>
                      <Descriptions.Item label="Initial Daily Cigarettes">
                        {mockSmokingProfile.initialDailyCigarettes}
                      </Descriptions.Item>
                      <Descriptions.Item label="Quit Start Date">
                        {mockSmokingProfile.quitStartDate}
                      </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginTop: 24 }}>
                      <h3>User Goals</h3>
                      <List
                        dataSource={mockGoals}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={item.goal}
                              description={`Target Date: ${item.targetDate} | Status: ${item.status}`}
                            />
                          </List.Item>
                        )}
                      />
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <h3>Current Progress</h3>
                      <Descriptions bordered>
                        <Descriptions.Item label="Days Smoke-Free">
                          {mockProgress.daysSmokeFree}
                        </Descriptions.Item>
                        <Descriptions.Item label="Money Saved">
                          {mockProgress.moneySaved}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <h3>Badges Achieved</h3>
                      <div style={{ display: "flex", gap: 8 }}>
                        {mockBadges.map((badge) => (
                          <Tag key={badge} color="blue">
                            {badge}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <h3>Consultation History</h3>
                      <List
                        dataSource={mockConsultations}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={item.coachName}
                              description={`Date: ${item.date} | Topic: ${item.topic}`}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
