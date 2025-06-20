import React, { useState, useEffect } from "react";
import styles from "./BlogManagement.module.css";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";
import EditPostModal from "./EditPostModal.jsx"; // Import modal component
import FilterBar from '../../../components/admin/AdminReusableUI/FilterBar';
import BulkActionBar from '../../../components/admin/AdminReusableUI/BulkActionBar';
import ActionDropdown from '../../../components/admin/AdminReusableUI/ActionDropdown';
import ReusableTable from '../../../components/admin/ReusableTable/ReusableTable';
import dayjs from 'dayjs';
import { message } from 'antd';

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
  const [selectedPosts, setSelectedPosts] = useState([]); // theo dõi posts được chọn
  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);

  // Filter logic
  useEffect(() => {
    let result = posts.filter(post => {
      const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.author.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus ? post.status === filterStatus : true;
      return matchSearch && matchStatus;
    });
    setFilteredPosts(result);
  }, [search, filterStatus, posts]);

  // Hàm render badge status
  const renderStatus = (status) => {
    if (status === "PUBLISHED")
      return <span className={styles["status-published"]}>PUBLISHED</span>;
    if (status === "UNDER REVIEW")
      return <span className={styles["status-review"]}>UNDER REVIEW</span>;
    return <span className={styles["status-rejected"]}>REJECTED</span>;
  };

  // Hàm xử lý reject
  const handleReject = async (postId) => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;

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
    } catch {
      alert("Failed to reject post");
    }
  };
  // Hàm xử lý delete
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      // API call here
      // await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch {
      alert("Failed to delete post");
    }
  };

  // Functions để handle edit modal
  const handleEdit = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleSavePost = async (updatedPost) => {
    try {
      // Cập nhật post trong state
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );

      // Đóng modal
      setShowEditModal(false);
      setEditingPost(null);
    } catch {
      throw new Error("Failed to save post");
    }
  };

  // Handler stubs for new actions (with toast)
  const handleView = (row) => { message.info(`Viewing post: ${row.title}`); };
  const handleUnpublish = (row) => { message.success(`Unpublished post: ${row.title}`); };
  const handlePublish = (row) => { message.success(`Published post: ${row.title}`); };
  const handleMoveToReview = (row) => { message.success(`Moved to review: ${row.title}`); };

  const columns = [
    { title: 'Post ID', dataIndex: 'id' },
    { title: 'Title', dataIndex: 'title' },
    { title: 'Author', dataIndex: 'author' },
    { title: 'Creation date', dataIndex: 'created', render: value => dayjs(value, ["D/M/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).format("DD/MM/YYYY") },
    { title: 'Last updated', dataIndex: 'updated', render: value => dayjs(value, ["D/M/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).format("DD/MM/YYYY") },
    { title: 'Status', dataIndex: 'status', render: renderStatus },
    { title: 'Views', dataIndex: 'views' },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (value, row) => {
        let actions = [];
        if (row.status === "PUBLISHED") {
          actions = [
            { key: 'view', label: 'View', onClick: () => handleView(row) },
            { key: 'edit', label: 'Edit', onClick: () => handleEdit(row) },
            { key: 'unpublish', label: 'Remove/Unpublish', onClick: () => handleUnpublish(row) },
            { key: 'delete', label: 'Delete', onClick: () => handleDelete(row.id), danger: true },
          ];
        } else if (row.status === "UNDER REVIEW") {
          actions = [
            { key: 'view', label: 'View/Review', onClick: () => handleView(row) },
            { key: 'publish', label: 'Publish', onClick: () => handlePublish(row) },
            { key: 'edit', label: 'Edit', onClick: () => handleEdit(row) },
            { key: 'reject', label: 'Reject', onClick: () => handleReject(row.id), danger: true },
            { key: 'delete', label: 'Delete', onClick: () => handleDelete(row.id), danger: true },
          ];
        } else if (row.status === "REJECTED") {
          actions = [
            { key: 'view', label: 'View', onClick: () => handleView(row) },
            { key: 'edit', label: 'Edit', onClick: () => handleEdit(row) },
            { key: 'publish', label: 'Publish', onClick: () => handlePublish(row) },
            { key: 'delete', label: 'Delete', onClick: () => handleDelete(row.id), danger: true },
            { key: 'moveToReview', label: 'Move to Review', onClick: () => handleMoveToReview(row) },
          ];
        }
        return <ActionDropdown actions={actions} />;
      }
    },
  ];

  // Filter posts by status
  const publishedPosts = filteredPosts.filter(p => p.status === 'PUBLISHED');
  const underReviewPosts = filteredPosts.filter(p => p.status === 'UNDER REVIEW');
  const rejectedPosts = filteredPosts.filter(p => p.status === 'REJECTED');

  // Section-specific selected posts
  const publishedSelected = selectedPosts.filter(id => publishedPosts.some(p => p.id === id));
  const underReviewSelected = selectedPosts.filter(id => underReviewPosts.some(p => p.id === id));
  const rejectedSelected = selectedPosts.filter(id => rejectedPosts.some(p => p.id === id));

  // Section-specific bulk action handler
  const handleBulkActionSection = (section) => (action) => {
    let ids = [];
    if (section === 'published') ids = publishedSelected;
    if (section === 'underReview') ids = underReviewSelected;
    if (section === 'rejected') ids = rejectedSelected;
    if (action === 'delete') {
      setPosts(posts.filter(post => !ids.includes(post.id)));
      setSelectedPosts(selectedPosts.filter(id => !ids.includes(id)));
      message.success('Deleted selected posts');
    }
  };

  return (
    <AdminLayout title="Blog Management">
      <div className={styles["blog-management-page"]}>
        <h2>Blog Management</h2>
        <FilterBar
          searchPlaceholder="Search by title, author..."
          searchValue={search}
          onSearchChange={e => setSearch(e.target.value)}
          filters={[{
            placeholder: 'Filter status',
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { value: '', label: 'All status' },
              { value: 'PUBLISHED', label: 'Published' },
              { value: 'UNDER REVIEW', label: 'Under Review' },
              { value: 'REJECTED', label: 'Rejected' },
            ]
          }]}
        />
        {/* Published Section */}
        <h3>Published</h3>
        {publishedSelected.length > 0 && (
          <BulkActionBar
            selectedCount={publishedSelected.length}
            onAction={handleBulkActionSection('published')}
            actions={[{ value: 'delete', label: 'Delete' }]}
          />
        )}
        <ReusableTable
          columns={columns}
          data={publishedPosts}
          selectedRowKeys={publishedSelected}
          onSelectAll={checked => {
            const ids = publishedPosts.map(p => p.id);
            setSelectedPosts(checked ? Array.from(new Set([...selectedPosts, ...ids])) : selectedPosts.filter(id => !ids.includes(id)));
          }}
          onSelectRow={(id, checked) => setSelectedPosts(prev => checked ? [...prev, id] : prev.filter(pid => pid !== id))}
        />
        {/* Under Review Section */}
        <h3>Under Review</h3>
        {underReviewSelected.length > 0 && (
          <BulkActionBar
            selectedCount={underReviewSelected.length}
            onAction={handleBulkActionSection('underReview')}
            actions={[{ value: 'delete', label: 'Delete' }]}
          />
        )}
        <ReusableTable
          columns={columns}
          data={underReviewPosts}
          selectedRowKeys={underReviewSelected}
          onSelectAll={checked => {
            const ids = underReviewPosts.map(p => p.id);
            setSelectedPosts(checked ? Array.from(new Set([...selectedPosts, ...ids])) : selectedPosts.filter(id => !ids.includes(id)));
          }}
          onSelectRow={(id, checked) => setSelectedPosts(prev => checked ? [...prev, id] : prev.filter(pid => pid !== id))}
        />
        {/* Rejected Section */}
        <h3>Rejected</h3>
        {rejectedSelected.length > 0 && (
          <BulkActionBar
            selectedCount={rejectedSelected.length}
            onAction={handleBulkActionSection('rejected')}
            actions={[{ value: 'delete', label: 'Delete' }]}
          />
        )}
        <ReusableTable
          columns={columns}
          data={rejectedPosts}
          selectedRowKeys={rejectedSelected}
          onSelectAll={checked => {
            const ids = rejectedPosts.map(p => p.id);
            setSelectedPosts(checked ? Array.from(new Set([...selectedPosts, ...ids])) : selectedPosts.filter(id => !ids.includes(id)));
          }}
          onSelectRow={(id, checked) => setSelectedPosts(prev => checked ? [...prev, id] : prev.filter(pid => pid !== id))}
        />
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
