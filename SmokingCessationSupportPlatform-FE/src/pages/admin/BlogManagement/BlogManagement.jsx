import React, { useState, useEffect } from "react";
import "./BlogManagement.css";
import ReusableTable from "../../../components/admin/ReusableTable/ReusableTable.jsx";
import { message, Modal, Form, Input, Select, Button } from "antd";
import { blogService } from "../../../services/blogService.js";
import Sidebar from "../../../components/admin/Sidebar/Sidebar.jsx";
import Header from "../../../components/admin/Header/Header.jsx";

const statusColors = {
  PUBLISHED: "status-published",
  "UNDER REVIEW": "status-review",
  REJECTED: "status-rejected",
  DRAFT: "status-draft",
};

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    author: "",
    article: "",
    startDate: "",
    endDate: "",
  });

  // Fetch posts data
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getPosts(filters);
      setPosts(response.data);
    } catch (error) {
      message.error("Failed to fetch posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeletePost = async (id) => {
    try {
      await blogService.deletePost(id);
      message.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      message.error("Failed to delete post");
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await blogService.updatePostStatus(id, status);
      message.success("Post status updated successfully");
      fetchPosts();
    } catch (error) {
      message.error("Failed to update post status");
      console.error("Error updating post status:", error);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    form.resetFields();
    form.setFieldsValue({ status: "DRAFT" });
    setIsModalVisible(true);
  };

  const handleEditPost = async (post) => {
    try {
      const postDetails = await blogService.getPostById(post.id);
      setEditingPost(postDetails);
      form.setFieldsValue(postDetails);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch post details");
      console.error("Error fetching post details:", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingPost(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingPost) {
        await blogService.updatePost(editingPost.id, values);
        message.success("Post updated successfully");
      } else {
        await blogService.createPost(values);
        message.success("Post created successfully");
      }
      setIsModalVisible(false);
      setEditingPost(null);
      form.resetFields();
      fetchPosts();
    } catch (error) {
      message.error(
        editingPost ? "Failed to update post" : "Failed to create post"
      );
      console.error("Error saving post:", error);
    }
  };

  const columns = [
    { title: "Post ID", dataIndex: "id" },
    { title: "Title", dataIndex: "title" },
    { title: "Author", dataIndex: "author" },
    { title: "Creation date", dataIndex: "creationDate" },
    { title: "Last updated", dataIndex: "lastUpdated" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <span className={`status-badge ${statusColors[value]}`}>
          {value.replace("_", " ")}
        </span>
      ),
    },
    { title: "Views", dataIndex: "views" },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <button
            className="action-btn edit"
            onClick={() => handleEditPost(record)}
          >
            Edit
          </button>
          <button
            className="action-btn delete"
            onClick={() => handleDeletePost(record.id)}
          >
            Delete
          </button>
          <button
            className="action-btn cancel"
            onClick={() => handleUpdateStatus(record.id, "REJECTED")}
          >
            Cancel publication
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="blog-management-page">
        <Header />
        <h2>Blog Management</h2>
        <div className="search-filter-row">
          <input
            className="search-input"
            placeholder="Search by title, author..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Filter by status</option>
            <option value="PUBLISHED">Published</option>
            <option value="UNDER REVIEW">Under Review</option>
            <option value="REJECTED">Rejected</option>
            <option value="DRAFT">Draft</option>
          </select>
          <select
            className="filter-select"
            value={filters.author}
            onChange={(e) => handleFilterChange("author", e.target.value)}
          >
            <option value="">Filter by author</option>
          </select>
          <select
            className="filter-select"
            value={filters.article}
            onChange={(e) => handleFilterChange("article", e.target.value)}
          >
            <option value="">Filter by article</option>
          </select>
          <input
            className="date-input"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
          <input
            className="date-input"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
          <button className="add-article-btn" onClick={handleCreatePost}>
            + Create new article
          </button>
        </div>
        <div className="blog-table-wrapper">
          <ReusableTable columns={columns} data={posts} loading={loading} />
        </div>

        <Modal
          title={
            editingPost ? `Edit Post: ${editingPost.title}` : "Create New Post"
          }
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{ status: "DRAFT" }}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please enter the post title" },
              ]}
            >
              <Input placeholder="Enter post title" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Content"
              rules={[
                { required: true, message: "Please enter the post content" },
              ]}
            >
              <Input.TextArea rows={8} placeholder="Enter post content" />
            </Form.Item>

            <Form.Item
              name="author"
              label="Author"
              rules={[{ required: true, message: "Please select an author" }]}
            >
              <Select placeholder="Select author">
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="coach">Coach</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Please select or enter categories",
                },
              ]}
            >
              <Select
                mode="tags"
                placeholder="Select or enter categories"
                style={{ width: "100%" }}
              >
                <Select.Option value="health">Health</Select.Option>
                <Select.Option value="wellness">Wellness</Select.Option>
                <Select.Option value="lifestyle">Lifestyle</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select>
                <Select.Option value="DRAFT">Draft</Select.Option>
                <Select.Option value="UNDER REVIEW">Under Review</Select.Option>
                {editingPost && (
                  <Select.Option value="PUBLISHED">Published</Select.Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <Button onClick={handleModalCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default BlogManagement;
