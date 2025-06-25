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

        {/* ...existing modal code... */}
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
