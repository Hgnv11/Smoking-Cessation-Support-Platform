import React, { useState, useEffect } from "react";
import "./CoachManagement.css";
import {
  Modal,
  Tabs,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
} from "antd";
import { coachService } from "../../../services/coachService.js";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";
import ReusableTable from "../../../components/admin/ReusableTable/ReusableTable.jsx";

const statusColors = {
  ACTIVE: "status-active",
  INACTIVE: "status-inactive",
};

const CoachManagement = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", order: "" });
  const [showAddCoachModal, setShowAddCoachModal] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("basic");
  const [filters, setFilters] = useState({
    search: "",
    expertise: "",
    status: "",
  });

  // Fetch coaches data
  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const response = await coachService.getCoaches(filters);
      setCoaches(response.data);
    } catch (error) {
      message.error("Failed to fetch coaches");
      console.error("Error fetching coaches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { key, order: "asc" };
    });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleAddCoach = async (values) => {
    try {
      await coachService.createCoach(values);
      message.success("Coach added successfully");
      setShowAddCoachModal(false);
      form.resetFields();
      fetchCoaches();
    } catch (error) {
      message.error("Failed to add coach");
      console.error("Error adding coach:", error);
    }
  };

  const handleUpdateCoach = async (id, values) => {
    try {
      await coachService.updateCoach(id, values);
      message.success("Coach updated successfully");
      fetchCoaches();
    } catch (error) {
      message.error("Failed to update coach");
      console.error("Error updating coach:", error);
    }
  };

  const handleDeleteCoach = async (id) => {
    try {
      await coachService.deleteCoach(id);
      message.success("Coach deleted successfully");
      fetchCoaches();
    } catch (error) {
      message.error("Failed to delete coach");
      console.error("Error deleting coach:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const coachDetails = await coachService.getCoachById(id);
      // TODO: Implement view details modal or navigation
      console.log("Coach details:", coachDetails);
    } catch (error) {
      message.error("Failed to fetch coach details");
      console.error("Error fetching coach details:", error);
    }
  };

  const columns = [
    { title: "User ID", dataIndex: "id", sortable: true, key: "id" },
    { title: "Coach name", dataIndex: "name", sortable: true, key: "name" },
    { title: "Email", dataIndex: "email", sortable: true, key: "email" },
    {
      title: "Expertise",
      dataIndex: "expertise",
      render: (value) => (
        <>
          {value.map((exp, i) => (
            <span className="expertise-badge" key={i}>
              {exp}
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sortable: true,
      key: "rating",
      render: (value) => (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < value ? "star filled" : "star"}>
              ★
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Number of consultations today",
      dataIndex: "todayConsults",
      sortable: true,
      key: "todayConsults",
    },
    {
      title: "Number of cases currently consulting",
      dataIndex: "currentCases",
      sortable: true,
      key: "currentCases",
    },
    {
      title: "Joining date",
      dataIndex: "joinDate",
      sortable: true,
      key: "joinDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      sortable: true,
      key: "status",
      render: (value) => (
        <span className={`status-badge ${statusColors[value]}`}>{value}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <button
            className="action-btn edit"
            onClick={() => handleUpdateCoach(record.id, record)}
          >
            Edit
          </button>
          <button
            className="action-btn details"
            onClick={() => handleViewDetails(record.id)}
          >
            See Details
          </button>
          <button
            className="action-btn delete"
            onClick={() => handleDeleteCoach(record.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  // Sorting logic
  const sortedCoaches = React.useMemo(() => {
    if (!sortConfig.key) return coaches;
    const sorted = [...coaches].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.order === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.order === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [coaches, sortConfig]);

  // Pagination logic
  const paginatedCoaches = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedCoaches.slice(start, start + pageSize);
  }, [sortedCoaches, page, pageSize]);

  return (
    <AdminLayout title="Coach Management">
      <div className="coach-management-page">
        <h2>Coach Management</h2>
        <div className="summary-cards-row">
          <div className="summary-card">
            <div className="summary-label">Active Coaches</div>
            <div className="summary-value">
              {coaches.filter((c) => c.status === "ACTIVE").length}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Today's Consultations</div>
            <div className="summary-value">
              {coaches.reduce((sum, c) => sum + c.todayConsults, 0)}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Avg. Rating</div>
            <div className="summary-value rating-value">
              <span role="img" aria-label="star">
                ⭐
              </span>
              {(
                coaches.reduce((sum, c) => sum + c.rating, 0) / coaches.length
              ).toFixed(1)}{" "}
              / 5
            </div>
          </div>
        </div>
        <div className="list-title">List of coaches</div>
        <div className="search-filter-row">
          <input
            className="search-input"
            placeholder="Search by name, email, profile name..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          <select
            className="filter-select"
            value={filters.expertise}
            onChange={(e) => handleFilterChange("expertise", e.target.value)}
          >
            <option value="">Filter expertise</option>
          </select>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Filter status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button
            className="add-user-btn"
            onClick={() => setShowAddCoachModal(true)}
          >
            + Add Coach
          </button>
        </div>
        <div className="coach-table-wrapper">
          <ReusableTable
            columns={columns}
            data={paginatedCoaches}
            loading={loading}
            pagination={{ page, pageSize, total: coaches.length }}
            onPageChange={handlePageChange}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        </div>
        <Modal
          title="Add New Coach"
          open={showAddCoachModal}
          onCancel={() => setShowAddCoachModal(false)}
          footer={null}
          width={700}
          destroyOnClose
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "basic",
                label: "Basic Info",
                children: (
                  <Form
                    form={form}
                    layout="vertical"
                    name="add-coach-form"
                    onFinish={handleAddCoach}
                    initialValues={{ gender: "Nam", status: "Active" }}
                  >
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <Form.Item
                          label="Full Name"
                          name="fullName"
                          rules={[
                            {
                              required: true,
                              message: "Please enter full name",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="Email (for login)"
                          name="email"
                          rules={[
                            { required: true, message: "Please enter email" },
                            {
                              type: "email",
                              message: "Please enter a valid email",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item label="Birth Date" name="birthDate">
                          <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                          label="Avatar URL (placeholder)"
                          name="avatarUrl"
                        >
                          <Input placeholder="https://example.com/avatar.jpg" />
                        </Form.Item>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Form.Item
                          label="Profile Name"
                          name="profileName"
                          rules={[
                            {
                              required: true,
                              message: "Please enter profile name",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item label="Phone number" name="phone">
                          <Input />
                        </Form.Item>
                        <Form.Item label="Gender" name="gender">
                          <Select>
                            <Select.Option value="Nam">Nam</Select.Option>
                            <Select.Option value="Nữ">Nữ</Select.Option>
                            <Select.Option value="Khác">Khác</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Account Status"
                          name="status"
                          rules={[
                            {
                              required: true,
                              message: "Please select account status",
                            },
                          ]}
                        >
                          <Select>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">
                              Inactive
                            </Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Initial Password"
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: "Please enter initial password",
                            },
                          ]}
                        >
                          <Input.Password placeholder="At least 6 characters" />
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                ),
              },
              {
                key: "professional",
                label: "Professional Info",
                children: (
                  <Form layout="vertical">
                    <Form.Item label="Experience Description" name="experience">
                      <Input.TextArea rows={6} />
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 24,
            }}
          >
            <Button onClick={() => setShowAddCoachModal(false)}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Add Coach
            </Button>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default CoachManagement;
