import React, { useState } from "react";
import styles from "./BlogManagement.module.css";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";
import EditPostModal from "./EditPostModal.jsx"; // Import modal component

const BlogManagement = () => {
  // Mock data cho bảng bài viết
  const [posts, setPosts] = useState([
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
  const [loading, setLoading] = useState(false); // theo dõi post đang được xử lý
  const [selectedPosts, setSelectedPosts] = useState([]); // theo dõi posts được chọn
  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Hàm render badge status
  const renderStatus = (status) => {
    if (status === "PUBLISHED")
      return <span className={styles["status-published"]}>PUBLISHED</span>;
    if (status === "UNDER REVIEW")
      return <span className={styles["status-review"]}>UNDER REVIEW</span>;
    return <span className={styles["status-rejected"]}>REJECTED</span>;
  };

  const renderActionButtons = (post) => {
    switch (post.status) {
      case "PUBLISHED":
        return (
          <>
            <button className="btn-primary" onClick={() => handleEdit(post)}>
              Edit
            </button>
            <button className="btn-warning">Unpublish</button>
            <button className="btn-danger">Delete</button>
          </>
        );

      case "UNDER REVIEW":
        return (
          <>
            <button className="btn-success" onClick={() => handleApprove(post.id)} disabled={loading}>
              {loading ? "Approving..." : "Approve"}
            </button>
            <button className="btn-danger" onClick={() => handleReject(post.id)} disabled={loading}>
              {loading ? "Rejecting..." : "Reject"}
            </button>
            <button className="btn-primary" onClick={() => handleEdit(post)}>
              Edit
            </button>
            <button className="btn-danger" onClick={() => handleDelete(post.id)} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </>
        );

      case "REJECTED":
        return (
          <>
            <button className="btn-primary" onClick={() => handleEdit(post)}>
              Edit
            </button>
            <button className="btn-info">Resubmit for Review</button>
            <button className="btn-danger" onClick={() => handleDelete(post.id)} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </>
        );

      default:
        return null;
    }
  };

  // Các hàm xử lý action
  // Hàm xử lý approve
  const handleApprove = async (postId) => {
    if (!window.confirm("Approve this post?")) return;

    setLoading(true);
    try {
      //1. API call here
      // await approvePost(postId);

      //2. Cập nhật trạng thái bài viết
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, status: "PUBLISHED", updated: new Date().toISOString() }
            : post
        )
      );
    } catch (error) {
      alert("Failed to approve post");
    } finally {
      setLoading(false);
    }
  };
  // Hàm xử lý reject
  const handleReject = async (postId) => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;

    setLoading(true);
    try {
      // API call here
      // await rejectPost(postId, reason);
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, status: "REJECTED", updated: new Date().toISOString() }
            : post
        )
      );
    } catch (error) {
      alert("Failed to reject post");
    } finally {
      setLoading(false);
    }
  };
  // Hàm xử lý delete
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    setLoading(true);
    try {
      // API call here
      // await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      alert("Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm xử lý select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Chọn tất cả posts
      setSelectedPosts(posts.map((post) => post.id));
    } else {
      // Bỏ chọn tất cả
      setSelectedPosts([]);
    }
  };

  // Thêm hàm xử lý select individual post
  const handleSelectPost = (postId) => {
    setSelectedPosts((prevSelected) => {
      if (prevSelected.includes(postId)) {
        // Nếu đã chọn thì bỏ chọn
        return prevSelected.filter((id) => id !== postId);
      } else {
        // Nếu chưa chọn thì thêm vào
        return [...prevSelected, postId];
      }
    });
  };
  // Thêm hàm xử lý bulk actions
  const handleBulkAction = async (action, selectElement) => {
    if (!action || selectedPosts.length === 0) return;

    const actionText = {
      approve: "approve",
      reject: "reject",
      delete: "delete",
    };

    if (
      !window.confirm(
        `Are you sure you want to ${actionText[action]} ${selectedPosts.length} selected posts?`
      )
    ) {
      // Reset select value if user cancels
      if (selectElement) selectElement.value = "";
      return;
    }

    setLoading(true);
    try {
      switch (action) {
        case "approve":
          setPosts(
            posts.map((post) =>
              selectedPosts.includes(post.id)
                ? { ...post, status: "PUBLISHED", updated: new Date().toISOString() }
                : post
            )
          );
          break;
        case "reject":
          setPosts(
            posts.map((post) =>
              selectedPosts.includes(post.id)
                ? { ...post, status: "REJECTED", updated: new Date().toISOString() }
                : post
            )
          );
          break;
        case "delete":
          setPosts(posts.filter((post) => !selectedPosts.includes(post.id)));
          break;
      }      setSelectedPosts([]); // Clear selection after action
    } catch {
      alert(`Failed to ${actionText[action]} posts`);
    } finally {
      setLoading(false);
      // Reset select value
      const selectElement = document.querySelector('.bulk-actions select');
      if (selectElement) selectElement.value = "";
    }
  };

  // Functions để handle edit modal
  const handleEdit = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleSavePost = async (updatedPost) => {
    setLoading(true);
    try {
      // Cập nhật post trong state
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );

      // Đóng modal
      setShowEditModal(false);
      setEditingPost(null);    } catch {
      throw new Error("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Blog Management">
      <div className={styles["blog-management-page"]}>
        <h2>Blog Management</h2>
        <div className={styles["search-filter-header"]}>Search and Filter</div>
        <div className={styles["search-filter-row"]}>
          <input className={styles["search-input"]} placeholder="Search by title, author,..." />
          <select className={styles["filter-select"]}>
            <option>Filter by status</option>
          </select>
          <select className={styles["filter-select"]}>
            <option>Filter by author</option>
          </select>
          <select className={styles["filter-select"]}>
            <option>Filter by article</option>
          </select>
          <input className={styles["date-input"]} placeholder="Start date" type="date" />
          <input className={styles["date-input"]} placeholder="End date" type="date" />
          <button className={styles["create-article-btn"]}>+ Create new article</button>
        </div>

        {/* Hiển thị các hành động bulk nếu có bài viết được chọn */}
        {selectedPosts.length > 0 && (
          <div className={styles["bulk-actions"]}>
            <span>{selectedPosts.length} posts selected</span>            <select onChange={(e) => handleBulkAction(e.target.value, e.target)} defaultValue="">
              <option value="">Bulk Actions</option>
              <option value="approve">Approve Selected</option>
              <option value="reject">Reject Selected</option>
              <option value="delete">Delete Selected</option>
            </select>
          </div>
        )}

        <div className={styles["blog-table-wrapper"]}>
          <table className={styles["blog-table"]}>
            <thead>
              <tr>
                {/* THÊM CHECKBOX SELECT ALL */}
                <th>
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === posts.length && posts.length > 0}
                    onChange={handleSelectAll}
                    disabled={loading}
                  />
                </th>
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
                  {/* THÊM CHECKBOX CHO TỪNG ROW */}
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(p.id)}
                      onChange={() => handleSelectPost(p.id)}
                      disabled={loading}
                    />
                  </td>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.author}</td>
                  <td>{p.created}</td>
                  <td>{p.updated}</td>
                  <td>{renderStatus(p.status)}</td>
                  <td>{p.views}</td>
                  <td>
                    <div className={styles["action-btns"]}>{renderActionButtons(p)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <EditPostModal
          post={editingPost}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSavePost}
        />
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;
