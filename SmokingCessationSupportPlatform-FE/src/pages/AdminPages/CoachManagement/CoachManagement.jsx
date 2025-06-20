import React, { useState, useEffect } from "react";
import styles from "./CoachManagement.module.css";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";
import FilterBar from '../../../components/admin/AdminReusableUI/FilterBar';
import BulkActionBar from '../../../components/admin/AdminReusableUI/BulkActionBar';
import ActionDropdown from '../../../components/admin/AdminReusableUI/ActionDropdown';
import ReusableTable from '../../../components/admin/ReusableTable/ReusableTable';
import dayjs from 'dayjs';

const CoachManagement = () => {
  // Mock data for summary cards
  const [statistics] = useState({
    activeCoaches: 5,
    todayConsultations: 7,
    avgRating: 4.8,
  });

  // Mock data for coaches table
  const [coaches] = useState([
    {
      id: "C001",
      name: "Emma Sarah",
      email: "emma.jack@example.com",
      expertise: ["Quit Smoking", "Reduce Stress"],
      rating: 4,
      todayConsults: 2,
      currentCases: 1,
      joinDate: "16/1/2023",
      status: "ACTIVE",
    },
    {
      id: "C002",
      name: "David Sad",
      email: "david.sad@example.com",
      expertise: ["Quit Smoking", "Healthy Lifestyle"],
      rating: 3,
      todayConsults: 4,
      currentCases: 2,
      joinDate: "16/1/2023",
      status: "INACTIVE",
    },
    {
      id: "C003",
      name: "Emma Saraher",
      email: "emma.saraher@example.com",
      expertise: ["Quit Smoking", "Fitness"],
      rating: 5,
      todayConsults: 0,
      currentCases: 1,
      joinDate: "16/1/2023",
      status: "ACTIVE",
    },
    {
      id: "C004",
      name: "John Doe",
      email: "john.doe@example.com",
      expertise: ["Motivation", "Diet"],
      rating: 2,
      todayConsults: 1,
      currentCases: 0,
      joinDate: "20/2/2023",
      status: "ACTIVE",
    },
    {
      id: "C005",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      expertise: ["Mindfulness"],
      rating: 5,
      todayConsults: 3,
      currentCases: 2,
      joinDate: "10/3/2023",
      status: "INACTIVE",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState(coaches);

  useEffect(() => {
    let result = coaches.filter(coach => {
      const matchSearch = coach.name.toLowerCase().includes(search.toLowerCase()) || coach.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus ? coach.status === filterStatus : true;
      return matchSearch && matchStatus;
    });
    setFilteredCoaches(result);
  }, [search, filterStatus, coaches]);

  // Move these functions above columns
  const renderExpertise = (expertiseArray) => (
    <>
      {expertiseArray.map((exp, i) => (
        <span key={i} className={styles["expertise-badge"]}>
          {exp}
        </span>
      ))}
    </>
  );

  const renderRating = (rating) => (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? `${styles["star"]} ${styles["filled"]}` : styles["star"]}>
          ★
        </span>
      ))}
    </>
  );

  const renderStatus = (status) => (
    <span className={`${styles["status-badge"]} ${status === "ACTIVE" ? styles["status-active"] : styles["status-inactive"]}`}>{status}</span>
  );

  const columns = [
    { title: 'User ID', dataIndex: 'id' },
    { title: 'Coach name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Expertise', dataIndex: 'expertise', render: renderExpertise },
    { title: 'Rating', dataIndex: 'rating', render: renderRating },
    { title: 'Number of consultations today', dataIndex: 'todayConsults' },
    { title: 'Number of cases currently consulting', dataIndex: 'currentCases' },
    { title: 'Joining date', dataIndex: 'joinDate', render: value => dayjs(value, ["D/M/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).format("DD/MM/YYYY") },
    { title: 'Status', dataIndex: 'status', render: renderStatus },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (value, row) => (
        <ActionDropdown
          actions={[
            { key: 'edit', label: 'Edit', onClick: () => {} },
            { key: 'calendar', label: 'Calendar', onClick: () => {} },
            row.status === 'ACTIVE'
              ? { key: 'deactive', label: 'Deactivate', onClick: () => {}, danger: true }
              : { key: 'active', label: 'Activate', onClick: () => {} },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="Coach Management">
      <div className={styles["coach-management-page"]}>
        <h2>Coach Management</h2>
        <div className={styles["summary-cards-row"]}>
          <div className={styles["summary-card"]}>
            <div className={styles["summary-label"]}>Active Coaches</div>
            <div className={styles["summary-value"]}>
              <span className={styles["summary-icon"]}>👥</span>
              {statistics.activeCoaches}
            </div>
          </div>
          <div className={styles["summary-card"]}>
            <div className={styles["summary-label"]}>Today's Consultations</div>
            <div className={styles["summary-value"]}>
              <span className={styles["summary-icon"]}>🗓️</span>
              {statistics.todayConsultations}
            </div>
          </div>
          <div className={styles["summary-card"]}>
            <div className={styles["summary-label"]}>Avg. Rating</div>
            <div className={`${styles["summary-value"]} ${styles["rating-value"]}`}>
              {renderRating(statistics.avgRating)} {statistics.avgRating} / 5
            </div>
          </div>
        </div>
        <div className={styles["list-title"]}>List of coaches</div>
        <FilterBar
          searchPlaceholder="Search by name, email..."
          searchValue={search}
          onSearchChange={e => setSearch(e.target.value)}
          filters={[{
            placeholder: 'Filter status',
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { value: '', label: 'All status' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]
          }]}
        />
        {selectedRows.length > 0 && (
          <BulkActionBar
            selectedCount={selectedRows.length}
            onAction={() => {}}
            actions={[]}
          />
        )}
        <ReusableTable
          columns={columns}
          data={filteredCoaches}
          selectedRowKeys={selectedRows}
          onSelectAll={checked => setSelectedRows(checked ? filteredCoaches.map(c => c.id) : [])}
          onSelectRow={(id, checked) => setSelectedRows(prev => checked ? [...prev, id] : prev.filter(cid => cid !== id))}
        />
      </div>
    </AdminLayout>
  );
};

export default CoachManagement;
