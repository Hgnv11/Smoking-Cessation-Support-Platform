import React, { useState } from "react";
import styles from "./BlogManagement.module.css";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";

const BlogManagement = () => {
  // Mock data cho bảng bài viết
  const [posts] = useState([
    {
      id: "B001",
      title: "Benefits of Quitting Smoking in the First Month",
      author: "Lisa Thompson (Coach)",
      created: "16/1/2023",
      updated: "2024-10-15",
      status: "PUBLISHED",
      views: 1000,
    },
    {
      id: "B002",
      title: "Managing Withdrawal Symptoms Effectively",
      author: "Emma (Admin)",
      created: "16/1/2023",
      updated: "2024-09-07",
      status: "UNDER REVIEW",
      views: 1530,
    },
    {
      id: "B003",
      title: "Smoking Cessation and Mental Health",
      author: "Emma (Admin)",
      created: "16/1/2023",
      updated: "2024-09-15",
      status: "PUBLISHED",
      views: 0,
    },
    {
      id: "B004",
      title: "Smoking Cessation and Mental Health",
      author: "Emma Sarah (Coach)",
      created: "16/1/2023",
      updated: "2024-09-11",
      status: "REJECTED",
      views: 0,
    },
    {
      id: "B005",
      title: "Smoking Cessation and Mental Health",
      author: "Emma Sarah (Coach)",
      created: "16/1/2023",
      updated: "2024-09-11",
      status: "REJECTED",
      views: 0,
    },
    {
      id: "B006",
      title: "Smoking Cessation and Mental Health",
      author: "Emma Sarah (Coach)",
      created: "16/1/2023",
      updated: "2024-09-11",
      status: "REJECTED",
      views: 0,
    },
  ]);

  // Hàm render badge status
  const renderStatus = (status) => {
    if (status === "PUBLISHED")
      return <span className={styles["status-published"]}>PUBLISHED</span>;
    if (status === "UNDER REVIEW")
      return <span className={styles["status-review"]}>UNDER REVIEW</span>;
    return <span className={styles["status-rejected"]}>REJECTED</span>;
  };

  return (
    <AdminLayout title="Blog Management">
      <div className={styles["blog-management-page"]}>
        <h2>Blog Management</h2>
        <div className={styles["search-filter-header"]}>Search and Filter</div>
        <div className={styles["search-filter-row"]}>
          <input className={styles["search-input"]} placeholder="Search by title, author,..." />
          <select className={styles["filter-select"]}><option>Filter by status</option></select>
          <select className={styles["filter-select"]}><option>Filter by author</option></select>
          <select className={styles["filter-select"]}><option>Filter by article</option></select>
          <input className={styles["date-input"]} placeholder="Start date" type="date" />
          <input className={styles["date-input"]} placeholder="End date" type="date" />
          <button className={styles["create-article-btn"]}>+ Create new article</button>
        </div>
        <div className={styles["blog-table-wrapper"]}>
          <table className={styles["blog-table"]}>
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Creation date</th>
                <th>Last updated</th>
                <th>Status</th>
                <th>Views</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.author}</td>
                  <td>{p.created}</td>
                  <td>{p.updated}</td>
                  <td>{renderStatus(p.status)}</td>
                  <td>{p.views}</td>
                  <td>
                    <div className={styles["action-btns"]}>
                      <button className={styles["edit-btn"]}>Edit</button>
                      <button className={styles["delete-btn"]}>Delete</button>
                      <button className={styles["cancel-btn"]}>Cancel publication</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;
