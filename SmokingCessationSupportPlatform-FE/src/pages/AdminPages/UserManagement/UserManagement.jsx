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
            author: u.email,
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
        user.author.toLowerCase().includes(search) ||
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

  const handleBulkLock = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedRowKeys.includes(u.id) ? { ...u, status: "locked" } : u
      )
    );
    setSelectedRowKeys([]);
    message.success(`${selectedRowKeys.length} users locked successfully`);
  };

  const handleBulkUnlock = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedRowKeys.includes(u.id) ? { ...u, status: "active" } : u
      )
    );
    setSelectedRowKeys([]);
    message.success(`${selectedRowKeys.length} users unlocked successfully`);
  };

  // ...existing mock data...
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
    { title: "Author", dataIndex: "author" },
    { title: "Profile name", dataIndex: "profile" },
    {
      title: "Role",
      dataIndex: "role",
      render: (value) => (
        <span className={value === "Coach" ? styles["role-coach"] : styles["role-customer"]}>
          {value}
        </span>
      ),
    },
    {
      title: "Membership package",
      dataIndex: "membership",
      render: (value) => (
        <span className={value === "Premium" ? styles["membership-premium"] : styles["membership-free"]}>
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
      render: (value, row) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => {}}>
              Edit
            </Menu.Item>
            <Menu.Item
              key="details"
              onClick={() => {
                setSelectedUser(row);
                setIsModalVisible(true);
              }}
            >
              See Details
            </Menu.Item>
            <Menu.Item
              key="delete"
              onClick={() => handleDeleteUser(row.id)}
              danger
            >
              Delete
            </Menu.Item>
            {row.status === "locked" ? (
              <Menu.Item key="unlock" style={{ color: "#1677ff" }}>
                Unlock account
              </Menu.Item>
            ) : (
              <Menu.Item key="lock" style={{ color: "#e74c3c" }}>
                Lock account
              </Menu.Item>
            )}
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

  return (
    <AdminLayout title="User Management">
      <div className={styles["user-management-page"]}>
        <h2>User Management</h2>
        <div className={styles["search-filter-header"]}>Search and Filter</div>
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
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
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
            style={{
              minWidth: 220,
              borderRadius: 12,
              boxShadow: "0 1px 4px rgba(99,102,241,0.08)",
            }}
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
            style={{
              minWidth: 220,
              borderRadius: 12,
              boxShadow: "0 1px 4px rgba(99,102,241,0.08)",
            }}
            onChange={(value) =>
              setFilters((f) => ({ ...f, role: value || "" }))
            }
            value={filters.role || undefined}
            options={roleOptions}
          />
        </div>
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
              onChange={(action) => {
                if (action === "delete") handleBulkDelete();
                if (action === "lock") handleBulkLock();
                if (action === "unlock") handleBulkUnlock();
              }}
              options={[
                { value: "delete", label: "Delete" },
                { value: "lock", label: "Lock" },
                { value: "unlock", label: "Unlock" },
              ]}
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

        {/* ...MODAL CODE... */}
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
          {/* Header: Avatar, Name, Email, Status, Membership */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 24,
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 18,
          }}>
            <div>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, color: "#6366f1", fontWeight: 700,
              }}>
                {selectedUser?.name?.[0] || "U"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{selectedUser?.name}</div>
              <div style={{ color: "#888", fontSize: 15 }}>{selectedUser?.author}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <Tag color={selectedUser?.status === "active" ? "green" : "red"}>
                  {selectedUser?.status === "active" ? "Active" : "Locked"}
                </Tag>
                <Tag color={selectedUser?.membership === "Premium" ? "gold" : "blue"}>
                  {selectedUser?.membership}
                </Tag>
                <Tag color={selectedUser?.role === "Coach" ? "purple" : "geekblue"}>
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
                    >
                      <Tag
                        color={selectedUser?.membership === "Premium" ? "gold" : "default"}
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
                        dataSource={mockSubscriptionHistory}
                        renderItem={(item) => (
                          <List.Item style={{ padding: "14px 0" }}>
                            <List.Item.Meta
                              title={
                                <b style={{ paddingLeft: 24}}>{item.plan}</b>
                              }
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
                                    color={item.plan === "Premium" ? "gold" : "default"}
                                    style={{ margin: 0, fontSize: 15, height: 28, display: "flex", alignItems: "center"}}
                                  >
                                    {item.plan}
                                  </Tag>
                                  {dayjs(item.startDate).format("DD.MM.YYYY")} &rarr; {dayjs(item.endDate).format("DD.MM.YYYY")}
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
                          rules={[{ required: true, message: "Please select a plan" }]}
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
                          <Tag color={mockSmokingProfile.status === "Active" ? "green" : "red"}>
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

                  {/* Smoking Cessation Goals */}
                    <Card
                      title="User Goals"
                      style={{ marginBottom: 24 }}
                      bodyStyle={{ padding: 0 }}
                    >
                      <div>
                        {mockGoals.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              borderBottom: idx !== mockGoals.length - 1 ? "1px solid #f0f0f0" : undefined,
                              padding: "16px 0 12px 0",
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
                              {item.goal}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
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
                                Target: {dayjs(item.targetDate).format("DD.MM.YYYY")}
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
                          <b style={{ color: "#1677ff", fontSize: 18 }}>{mockProgress.daysSmokeFree}</b>
                        </Descriptions.Item>
                        <Descriptions.Item label="Money Saved">
                          <b style={{ color: "#52c41a", fontSize: 18 }}>{mockProgress.moneySaved}</b>
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
                        {mockBadges.map((badge) => (
                          <Tag key={badge} color="blue" style={{ fontSize: 15, padding: "6px 18px" }}>
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
