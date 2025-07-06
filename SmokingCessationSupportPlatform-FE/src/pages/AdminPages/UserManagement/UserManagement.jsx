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
  Dropdown,
  Menu,
  Input,
  message,
  Card,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { userService } from "../../../services/userService.js";

// Constants
const FILTER_OPTIONS = {
  membership: [
    { value: "", label: "Filter membership packages" },
    { value: "Premium", label: "Premium" },
    { value: "Free", label: "Free" },
  ],
  status: [
    { value: "", label: "Filter account status" },
    { value: "active", label: "Active" },
    { value: "locked", label: "Locked" },
  ],
  role: [
    { value: "", label: "Filter roles" },
    { value: "Customer", label: "Customer" },
    { value: "Coach", label: "Coach" },
  ],
};

const BULK_ACTIONS = [
  { value: "delete", label: "Delete" },
  { value: "lock", label: "Lock" },
  { value: "unlock", label: "Unlock" },
];

const USER_STATUS = {
  ACTIVE: "active",
  LOCKED: "locked",
};

// Utility functions
const transformUserData = (userData) => ({
  id: userData.userId,
  name: userData.fullName,
  author: userData.email,
  profile: userData.profileName,
  role: userData.role,
  membership: userData.typeLogin,
  joinDate: userData.createdAt,
  lastActivity: userData.lastLogin,
  status: userData.block ? USER_STATUS.LOCKED : USER_STATUS.ACTIVE,
});

const filterUsers = (users, filters) => {
  return users.filter((user) => {
    const searchTerm = filters.search?.toLowerCase().trim() || "";

    const matchesSearch =
      !searchTerm ||
      [user.name, user.author, user.profile].some((field) =>
        field?.toLowerCase().includes(searchTerm)
      );

    const matchesMembership =
      !filters.membership || user.membership === filters.membership;
    const matchesStatus = !filters.status || user.status === filters.status;
    const matchesRole = !filters.role || user.role === filters.role;

    return (
      matchesSearch && matchesMembership && matchesStatus && matchesRole
    );
  });
};

const UserManagement = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    membership: "",
    status: "",
    role: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Computed values
  const filteredUsers = filterUsers(users, filters);

  // Mock data
  const mockData = {
    subscriptionHistory: [
      { plan: "Premium", startDate: "2024-01-01", endDate: "2024-02-01" },
      { plan: "Free", startDate: "2023-12-01", endDate: "2023-12-31" },
    ],
    smokingProfile: {
      status: "Active",
      initialDailyCigarettes: 20,
      quitStartDate: "2024-01-15",
    },
    goals: [
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
    ],
    progress: {
      daysSmokeFree: 15,
      moneySaved: "$150",
    },
    badges: ["First Week", "One Month", "Money Saver"],
    consultations: [
      { coachName: "Dr. Smith", date: "2024-01-20", topic: "Initial Assessment" },
      { coachName: "Dr. Johnson", date: "2024-01-27", topic: "Progress Review" },
    ],
  };

  // API functions
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.fetchAdminUsers();
      const transformedUsers = data.map(transformUserData);
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user. Please try again.");
    }
  };

  const bulkDeleteUsers = async (userIds) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userIds.length} users? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await Promise.all(userIds.map((id) => userService.deleteUser(id)));
      setUsers((prev) => prev.filter((user) => !userIds.includes(user.id)));
      setSelectedRowKeys([]);
      message.success(`${userIds.length} users deleted successfully`);
    } catch (error) {
      console.error("Failed to delete users:", error);
      message.error("Failed to delete some users. Please try again.");
    }
  };

  const updateUserStatus = (userIds, newStatus) => {
    setUsers((prev) =>
      prev.map((user) =>
        userIds.includes(user.id) ? { ...user, status: newStatus } : user
      )
    );
    const action = newStatus === USER_STATUS.LOCKED ? "locked" : "unlocked";
    message.success(`${userIds.length} users ${action} successfully`);
  };

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelectedRowKeys([]); // Clear selections when filters change
  };

  const handleSelectAll = (checked) => {
    setSelectedRowKeys(checked ? filteredUsers.map((u) => u.id) : []);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedRowKeys((prev) =>
      checked ? [...prev, id] : prev.filter((key) => key !== id)
    );
  };

  const handleBulkAction = (action) => {
    if (selectedRowKeys.length === 0) return;

    switch (action) {
      case "delete":
        bulkDeleteUsers(selectedRowKeys);
        break;
      case "lock":
        updateUserStatus(selectedRowKeys, USER_STATUS.LOCKED);
        setSelectedRowKeys([]);
        break;
      case "unlock":
        updateUserStatus(selectedRowKeys, USER_STATUS.ACTIVE);
        setSelectedRowKeys([]);
        break;
      default:
        message.warning("Unknown action");
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleToggleUserStatus = (userId, currentStatus) => {
    const newStatus =
      currentStatus === USER_STATUS.LOCKED
        ? USER_STATUS.ACTIVE
        : USER_STATUS.LOCKED;
    updateUserStatus([userId], newStatus);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // Table columns
  const columns = [
    { title: "User ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "author" },
    { title: "Profile name", dataIndex: "profile" },
    {
      title: "Role",
      dataIndex: "role",
      render: (value) => (
        <span
          className={
            value === "Coach"
              ? styles["role-coach"]
              : styles["role-customer"]
          }
        >
          {value}
        </span>
      ),
    },
    {
      title: "Membership",
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
      render: (value) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Last activity",
      dataIndex: "lastActivity",
      render: (value) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, row) => {
        const menu = (
          <Menu>
            <Menu.Item key="details" onClick={() => handleViewDetails(row)}>
              See Details
            </Menu.Item>
            <Menu.Item key="delete" danger onClick={() => deleteUser(row.id)}>
              Delete
            </Menu.Item>
            <Menu.Item
              key={row.status === USER_STATUS.LOCKED ? "unlock" : "lock"}
              style={{
                color:
                  row.status === USER_STATUS.LOCKED ? "#1677ff" : "#e74c3c",
              }}
              onClick={() => handleToggleUserStatus(row.id, row.status)}
            >
              {row.status === USER_STATUS.LOCKED
                ? "Unlock account"
                : "Lock account"}
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["hover"]} placement="bottomLeft">
            <Button>Actions</Button>
          </Dropdown>
        );
      },
    },
  ];

  // Effects
  useEffect(() => {
    fetchUsers();
  }, []);

  // Component render
  return (
    <AdminLayout title="User Management">
      <div className={styles["user-management-page"]}>
        <h2>User Management</h2>

        <div className={styles["search-filter-header"]}>Search and Filter</div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Input.Search
            placeholder="Search by name, email, profile name..."
            allowClear
            style={{
              minWidth: 260,
              borderRadius: 12,
              boxShadow: "0 1px 4px rgba(99,102,241,0.08)",
            }}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          <Select
            showSearch
            allowClear
            placeholder="Filter membership packages"
            style={{
              minWidth: 220,
              borderRadius: 12,
              boxShadow: "0 1px 4px rgba(99,102,241,0.08)",
            }}
            onChange={(value) => handleFilterChange("membership", value || "")}
            value={filters.membership || undefined}
            options={FILTER_OPTIONS.membership}
          />

          <Select
            showSearch
            allowClear
            placeholder="Filter account status"
            style={{
              minWidth: 220,
              borderRadius: 12,
              boxShadow: "0 1px 4px rgba(99,102,241,0.08)",
            }}
            onChange={(value) => handleFilterChange("status", value || "")}
            value={filters.status || undefined}
            options={FILTER_OPTIONS.status}
          />

          <Select
            showSearch
            allowClear
            placeholder="Filter roles"
            style={{
              minWidth: 220,
              borderRadius: 12,
              boxShadow: "0 1px 4px rgba(99,102,241,0.08)",
            }}
            onChange={(value) => handleFilterChange("role", value || "")}
            value={filters.role || undefined}
            options={FILTER_OPTIONS.role}
          />
        </div>

        {/* Bulk Actions */}
        {selectedRowKeys.length > 0 && (
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "#f9fbff",
              borderRadius: 12,
              padding: "12px 20px",
              boxShadow: "0 1px 4px rgba(99,102,241,0.06)",
            }}
          >
            <span style={{ fontWeight: 500 }}>
              {selectedRowKeys.length} users selected
            </span>
            <Select
              placeholder="Bulk Actions"
              style={{ minWidth: 160 }}
              onChange={handleBulkAction}
              options={BULK_ACTIONS}
            />
          </div>
        )}

        {/* User Table */}
        <div className={styles["user-table-wrapper"]}>
          <ReusableTable
            columns={columns}
            data={filteredUsers}
            selectedRowKeys={selectedRowKeys}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            loading={loading}
          />
        </div>

        {/* User Detail Modal */}
        <Modal
          title={null}
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" onClick={handleCloseModal}>
              Close
            </Button>,
          ]}
          width={850}
        >
          {/* User Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 24,
              borderBottom: "1px solid #f0f0f0",
              paddingBottom: 18,
            }}
          >
            <div>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#e0e7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  color: "#6366f1",
                  fontWeight: 700,
                }}
              >
                {selectedUser?.name?.[0] || "U"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {selectedUser?.name}
              </div>
              <div style={{ color: "#888", fontSize: 15 }}>
                {selectedUser?.author}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <Tag
                  color={
                    selectedUser?.status === USER_STATUS.ACTIVE
                      ? "green"
                      : "red"
                  }
                >
                  {selectedUser?.status === USER_STATUS.ACTIVE
                    ? "Active"
                    : "Locked"}
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

          {/* User Details Tabs */}
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
                    >
                      <Tag
                        color={
                          selectedUser?.membership === "Premium"
                            ? "gold"
                            : "default"
                        }
                        style={{ fontSize: 16, padding: "6px 18px" }}
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
                        dataSource={mockData.subscriptionHistory}
                        renderItem={(item) => (
                          <List.Item style={{ padding: "14px 0" }}>
                            <List.Item.Meta
                              title={<b style={{ paddingLeft: 24 }}>{item.plan}</b>}
                              description={
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    paddingLeft: 12,
                                    fontSize: 16,
                                    color: "#555",
                                  }}
                                >
                                  <Tag
                                    color={
                                      item.plan === "Premium" ? "gold" : "default"
                                    }
                                    style={{
                                      margin: 0,
                                      fontSize: 15,
                                      height: 28,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {item.plan}
                                  </Tag>
                                  {dayjs(item.startDate).format("DD.MM.YYYY")} &rarr;{" "}
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
                          <Select style={{ minWidth: 120 }}>
                            <Select.Option value="Premium">Premium</Select.Option>
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
                              mockData.smokingProfile.status === "Active"
                                ? "green"
                                : "red"
                            }
                          >
                            {mockData.smokingProfile.status}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Initial Daily Cigarettes">
                          {mockData.smokingProfile.initialDailyCigarettes}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quit Start Date">
                          {mockData.smokingProfile.quitStartDate}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    <Card
                      title="User Goals"
                      style={{ marginBottom: 24 }}
                      bodyStyle={{ padding: 0 }}
                    >
                      <div>
                        {mockData.goals.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              borderBottom:
                                idx !== mockData.goals.length - 1
                                  ? "1px solid #f0f0f0"
                                  : undefined,
                              padding: "16px 0 12px 0",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: 17,
                                marginBottom: 6,
                              }}
                            >
                              {item.goal}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginBottom: 4,
                              }}
                            >
                              <Tag
                                color={
                                  item.status === "Completed"
                                    ? "green"
                                    : item.status === "In Progress"
                                    ? "blue"
                                    : "default"
                                }
                                style={{
                                  fontSize: 15,
                                  height: 28,
                                  display: "flex",
                                  alignItems: "center",
                                  margin: 0,
                                }}
                              >
                                {item.status}
                              </Tag>
                              <span style={{ color: "#888", fontSize: 15 }}>
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
                          <b
                            style={{
                              color: "#1677ff",
                              fontSize: 18,
                            }}
                          >
                            {mockData.progress.daysSmokeFree}
                          </b>
                        </Descriptions.Item>
                        <Descriptions.Item label="Money Saved">
                          <b
                            style={{
                              color: "#52c41a",
                              fontSize: 18,
                            }}
                          >
                            {mockData.progress.moneySaved}
                          </b>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    <Card
                      title="Badges Achieved"
                      bordered={false}
                      style={{ marginBottom: 24 }}
                      bodyStyle={{ padding: 12 }}
                    >
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {mockData.badges.map((badge) => (
                          <Tag
                            key={badge}
                            color="blue"
                            style={{ fontSize: 15, padding: "6px 18px" }}
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
                        dataSource={mockData.consultations}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={<b>{item.coachName}</b>}
                              description={
                                <span>
                                  <Tag color="geekblue">{item.topic}</Tag> Date:{" "}
                                  {item.date}
                                </span>
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
