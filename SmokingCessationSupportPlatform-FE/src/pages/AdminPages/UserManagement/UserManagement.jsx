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
import ModalForDetailsButton from "./ModalForDetailsButton.jsx";

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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch users khi component mount
  useEffect(() => {
    const getUsers = async () => {
      setLoadingUsers(true);
      try {
        const data = await userService.fetchAdminUsers();
        const transformedUsers = data.map((u) => ({
          id: u.userId,
          name: u.fullName,
          email: u.email,
          profile: u.profileName,
          role: u.role,
          membership: u.typeLogin,
          joinDate: u.createdAt,
          lastActivity: u.lastLogin,
          status: u.block ? "locked" : "active",
        }));
        setUsers(transformedUsers);
      } catch (err) {
        console.error("Failed to fetch users", err);
        message.error("Failed to fetch users. Please try again.");
      } finally {
        setLoadingUsers(false);
      }
    };
    getUsers();
  }, []); //chỉ chạy một lần khi component mount

  // Filter users khi filters hoặc users thay đổi
  useEffect(() => {
    const filterUsers = () => {
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
      setSelectedRowKeys([]); // Reset selection khi filter
    };

    filterUsers();
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

  // View user details
  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    setLoadingDetail(true);

    try {
      if (user.role === "Customer" || user.role === "user") {
        // Đối với Customer/user: lấy smoking progress
        const data = await userService.getSmokingProgressId(user.id);
        setUserDetail(data && data.length > 0 ? data[0] : null);
      } else if (user.role === "Admin" || user.role === "Coach") {
        // Đối với Admin và Coach: lấy thông tin chi tiết từ endpoint khác
        const data = await userService.getUserById(user.id);
        setUserDetail(data);
      } else {
        // Các role khác không fetch thêm data
        setUserDetail(null);
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err);

      if (err.response?.status === 500) {
        message.error("Server error. Please try again later.");
      } else if (err.response?.status === 404) {
        message.warning("User details not found.");
      } else {
        message.error("Failed to load user details");
      }

      setUserDetail(null);
    } finally {
      setLoadingDetail(false);
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
          {/* Details button */}
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetails(row)}
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
            loading={loadingUsers}
          />
        </div>

        {/* Modal for User Details */}
        <ModalForDetailsButton
          open={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setUserDetail(null);
            setLoadingDetail(false);
          }}
          selectedUser={selectedUser}
          userDetail={userDetail}
          loadingDetail={loadingDetail}
        />
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
