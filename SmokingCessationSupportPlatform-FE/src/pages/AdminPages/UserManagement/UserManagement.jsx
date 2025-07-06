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
  Input,
  message,
  Card,
  Space,
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { userService } from "../../../services/userService.js";

const membershipOptions = [
  { value: "", label: "Filter membership" },
  { value: "Premium", label: "Premium" },
  { value: "Free", label: "Free" },
];
const statusOptions = [
  { value: "", label: "Filter account status" },
  { value: "active", label: "Active" },
];
const roleOptions = [
  { value: "", label: "Filter roles" },
  { value: "Customer", label: "Customer" },
  { value: "Coach", label: "Coach" },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    membership: "",
    status: "",
    role: "",
  });
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Gọi API lấy danh sách user khi vào trang
    const getUsers = async () => {
      try {
        const data = await userService.fetchAdminUsers();
        setUsers(
          data.map((u) => ({
            id: u.userId,
            name: u.fullName,
            email: u.email,
            profile: u.profileName,
            role: u.role,
            membership: u.typeLogin,
            joinDate: u.createdAt,
            lastActivity: u.lastLogin,
            status: u.block ? "locked" : "active",
          }))
        );
      } catch (err) {
        // Quăng lỗi khi axios false
        console.error("Failed to fetch users", err);
        message.error("Failed to fetch users");
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    let result = users.filter((user) => {
      const search = filters.search.toLowerCase();
      const matchSearch =
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.profile.toLowerCase().includes(search);
      const matchMembership = filters.membership
        ? user.membership === filters.membership
        : true;
      const matchStatus = filters.status
        ? user.status === filters.status
        : true;
      const matchRole = filters.role ? user.role === filters.role : true;
      return matchSearch && matchMembership && matchStatus && matchRole;
    });
    setFilteredUsers(result);
    setSelectedRowKeys([]);
  }, [filters, users]);

  // Delete single user
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user. Please try again.");
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedRowKeys(checked ? filteredUsers.map((u) => u.id) : []);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedRowKeys((prev) =>
      checked ? [...prev, id] : prev.filter((key) => key !== id)
    );
  };

  // Bulk delete users
  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRowKeys.length} users? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // Delete multiple users using Promise.all
      await Promise.all(
        selectedRowKeys.map((userId) => userService.deleteUser(userId))
      );

      setUsers((prev) => prev.filter((u) => !selectedRowKeys.includes(u.id)));
      setSelectedRowKeys([]);
      message.success(`${selectedRowKeys.length} users deleted successfully`);
    } catch (error) {
      console.error("Failed to delete users:", error);
      message.error("Failed to delete some users. Please try again.");
    }
  };

  // Mock data
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

  const columns = [
    { title: "User ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
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
    {
      title: "Joining date",
      dataIndex: "joinDate",
      render: (value) =>
        dayjs(value, ["D/M/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).format(
          "DD/MM/YYYY"
        ),
    },
    {
      title: "Last activity",
      dataIndex: "lastActivity",
      render: (value) =>
        dayjs(value, ["D/M/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).format(
          "DD/MM/YYYY"
        ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, row) => (
        <Space size="small">
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {}}
          >
            Edit
          </Button>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedUser(row);
              setIsModalVisible(true);
            }}
          >
            Details
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteUser(row.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout title="User Management">
      <div className={styles["user-management-page"]}>
        <h2>User Management</h2>
        <div className={styles["search-filter-row"]}>
          <Input.Search
            placeholder="Search by name, email, profile name..."
            allowClear
            size="large"
            style={{ minWidth: 260 }}
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
          <Select
            showSearch
            allowClear
            placeholder="Filter membership"
            size="large"
            style={{ minWidth: 220 }}
            onChange={(value) =>
              setFilters((f) => ({ ...f, membership: value || "" }))
            }
            value={filters.membership || undefined}
            options={membershipOptions}
          />
          <Select
            showSearch
            allowClear
            placeholder="Filter account status"
            size="large"
            style={{ minWidth: 220 }}
            onChange={(value) =>
              setFilters((f) => ({ ...f, status: value || "" }))
            }
            value={filters.status || undefined}
            options={statusOptions}
          />
          <Select
            showSearch
            allowClear
            placeholder="Filter roles"
            size="large"
            style={{ minWidth: 220 }}
            onChange={(value) =>
              setFilters((f) => ({ ...f, role: value || "" }))
            }
            value={filters.role || undefined}
            options={roleOptions}
          />
        </div>
        {selectedRowKeys.length > 0 && (
          <div className={styles["bulk-actions"]}>
            <span>{selectedRowKeys.length} users selected</span>
            <Select
              placeholder="Bulk Actions"
              className={styles["bulk-actions-select"]}
              onChange={(action) => {
                if (action === "delete") handleBulkDelete();
              }}
              options={[{ value: "delete", label: "Delete" }]}
            />
          </div>
        )}
        <div className={styles["user-table-wrapper"]}>
          <ReusableTable
            columns={columns}
            data={filteredUsers}
            selectedRowKeys={selectedRowKeys}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
          />
        </div>

        {/* Modal for User Details */}
        <Modal
          title={null}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={850}
        >
          <div className={styles["modal-header"]}>
            <div className={styles["user-avatar"]}>
              {selectedUser?.name?.[0] || "U"}
            </div>
            <div className={styles["user-info"]}>
              <h3>{selectedUser?.name}</h3>
              <div className={styles["email"]}>{selectedUser?.email}</div>
              <div className={styles["user-tags"]}>
                <Tag
                  color={selectedUser?.status === "active" ? "green" : "red"}
                >
                  {selectedUser?.status === "active" ? "Active" : "Locked"}
                </Tag>
                <Tag
                  color={
                    selectedUser?.membership === "Premium" ? "gold" : "blue"
                  }
                >
                  {selectedUser?.membership}
                </Tag>
                <Tag
                  color={selectedUser?.role === "Coach" ? "purple" : "geekblue"}
                >
                  {selectedUser?.role}
                </Tag>
              </div>
            </div>
          </div>

          <Tabs
            defaultActiveKey="membership"
            items={[
              {
                key: "membership",
                label: "Membership Information",
                children: (
                  <div>
                    <Card
                      title="Current Membership"
                      style={{ marginBottom: 24 }}
                      bordered={false}
                      bodyStyle={{ padding: 16 }}
                      className={styles["membership-card"]}
                    >
                      <Tag
                        color={
                          selectedUser?.membership === "Premium"
                            ? "gold"
                            : "default"
                        }
                      >
                        {selectedUser?.membership}
                      </Tag>
                    </Card>

                    <Card
                      title="Subscription History"
                      style={{ marginBottom: 24 }}
                      bordered={false}
                      bodyStyle={{ padding: 0 }}
                    >
                      <List
                        dataSource={mockSubscriptionHistory}
                        renderItem={(item) => (
                          <List.Item className={styles["subscription-item"]}>
                            <List.Item.Meta
                              title={
                                <b style={{ paddingLeft: 24 }}>{item.plan}</b>
                              }
                              description={
                                <span
                                  className={styles["subscription-description"]}
                                >
                                  <Tag
                                    color={
                                      item.plan === "Premium"
                                        ? "gold"
                                        : "default"
                                    }
                                    className={styles["subscription-tag"]}
                                  >
                                    {item.plan}
                                  </Tag>
                                  {dayjs(item.startDate).format("DD.MM.YYYY")}{" "}
                                  &rarr;{" "}
                                  {dayjs(item.endDate).format("DD.MM.YYYY")}
                                </span>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Card>

                    <Card
                      title="Update Membership Plan"
                      bordered={false}
                      bodyStyle={{ padding: 16 }}
                    >
                      <Form
                        form={form}
                        onFinish={() => {
                          /* handleUpdatePlan */
                        }}
                        layout="inline"
                      >
                        <Form.Item
                          name="newPlan"
                          label="New Plan"
                          rules={[
                            { required: true, message: "Please select a plan" },
                          ]}
                        >
                          <Select className={styles["plan-form"]}>
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
                    </Card>
                  </div>
                ),
              },
              {
                key: "smoking",
                label: "Smoking Cessation Info",
                children: (
                  <div>
                    <Card
                      title="Smoking Profile"
                      bordered={false}
                      style={{ marginBottom: 24 }}
                      bodyStyle={{ padding: 16 }}
                    >
                      <Descriptions column={3} bordered size="small">
                        <Descriptions.Item label="Status">
                          <Tag
                            color={
                              mockSmokingProfile.status === "Active"
                                ? "green"
                                : "red"
                            }
                          >
                            {mockSmokingProfile.status}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Initial Daily Cigarettes">
                          {mockSmokingProfile.initialDailyCigarettes}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quit Start Date">
                          {mockSmokingProfile.quitStartDate}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    <Card
                      title="User Goals"
                      style={{ marginBottom: 24 }}
                      bodyStyle={{ padding: 0 }}
                    >
                      <div>
                        {mockGoals.map((item, idx) => (
                          <div key={idx} className={styles["goal-item"]}>
                            <div className={styles["goal-title"]}>
                              {item.goal}
                            </div>
                            <div className={styles["goal-info"]}>
                              <Tag
                                color={
                                  item.status === "Completed"
                                    ? "green"
                                    : item.status === "In Progress"
                                    ? "blue"
                                    : "default"
                                }
                                className={styles["goal-status-tag"]}
                              >
                                {item.status}
                              </Tag>
                              <span className={styles["goal-target"]}>
                                Target:{" "}
                                {dayjs(item.targetDate).format("DD.MM.YYYY")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card
                      title="Current Progress"
                      bordered={false}
                      style={{ marginBottom: 24 }}
                      bodyStyle={{ padding: 16 }}
                    >
                      <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Days Smoke-Free">
                          <span className={styles["progress-value"]}>
                            {mockProgress.daysSmokeFree}
                          </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Money Saved">
                          <span className={styles["money-saved"]}>
                            {mockProgress.moneySaved}
                          </span>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    <Card
                      title="Badges Achieved"
                      bordered={false}
                      style={{ marginBottom: 24 }}
                      bodyStyle={{ padding: 12 }}
                    >
                      <div className={styles["badges-container"]}>
                        {mockBadges.map((badge) => (
                          <Tag
                            key={badge}
                            color="blue"
                            className={styles["badge-tag"]}
                          >
                            {badge}
                          </Tag>
                        ))}
                      </div>
                    </Card>

                    <Card
                      title="Consultation History"
                      bordered={false}
                      bodyStyle={{ padding: 0 }}
                    >
                      <List
                        dataSource={mockConsultations}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={<b>{item.coachName}</b>}
                              description={
                                <>
                                  <span>
                                    <Tag color="geekblue">{item.topic}</Tag>
                                    Date: {item.date}
                                  </span>
                                </>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
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
