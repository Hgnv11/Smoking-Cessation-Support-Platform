import { useState, useEffect } from "react";
import styles from "./BlogManagement.module.css";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";
import EditPostModal from "./EditPostModal.jsx";
import FilterBar from "../../../components/admin/AdminReusableUI/FilterBar";
import BulkActionBar from "../../../components/admin/AdminReusableUI/BulkActionBar";
import ReusableTable from "../../../components/admin/ReusableTable/ReusableTable";
import dayjs from "dayjs";
import {
  Image,
  message,
  Spin,
  Modal,
  Empty,
  Typography,
  Tag,
  Button,
  Space,
} from "antd";
import {
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { blogService } from "../../../services/blogService";

const { confirm } = Modal;
const { Title, Text, Paragraph } = Typography;

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingPost, setViewingPost] = useState(null);
  const [loadingPostDetail, setLoadingPostDetail] = useState(false);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await blogService.getPosts();
        // Map API response to match component structure
        const postsData = Array.isArray(response)
          ? response
          : response.data || [];

        // Transform API data to match component expectations
        const transformedPosts = postsData.map((post) => ({
          id: post.postId,
          title: post.title,
          author: post.user?.fullName || post.user?.profileName || "Unknown",
          content: post.content,
          imageUrl: post.imageUrl,
          postType: post.postType,
          updated: post.updatedAt,
          status: post.isApproved,
          user: post.user,
        }));

        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        message.error("Failed to load posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = posts.filter((post) => {
      const matchSearch =
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.author?.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        filterStatus !== "" ? post.status === filterStatus : true;
      return matchSearch && matchStatus;
    });
    setFilteredPosts(result);
  }, [search, filterStatus, posts]);

  // Hàm render badge status
  const renderStatus = (status) => {
    if (status === true)
      return <span className={styles["status-published"]}>PUBLISHED</span>;
    return <span className={styles["status-rejected"]}>NOT PUBLISHED</span>;
  };

  // Hàm render image
  const renderImage = (imageUrl) => {
    if (!imageUrl) {
      return (
        <span style={{ color: "#999", fontStyle: "italic" }}>No image</span>
      );
    }
    return (
      <Image
        src={imageUrl}
        alt="PostImage"
        style={{
          width: "100px",
          height: "70px",
          objectFit: "cover",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "inline";
        }}
      />
    );
  };

  // Hàm xử lý delete với Ant Design Modal confirm
  const handleDelete = (id, postTitle) => {
    confirm({
      title: "Delete Post",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await blogService.deletePost(id);
          setPosts(posts.filter((post) => post.id !== id));
          message.success("Post deleted successfully");
        } catch (error) {
          console.error("Error deleting post:", error);
          message.error("Failed to delete post");
        }
      },
      onCancel() {
        // User cancelled, do nothing
      },
    });
  };

  // Functions để handle edit modal
  const handleEdit = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleSavePost = async (updatedPost) => {
    try {
      await blogService.updatePost(updatedPost.id, updatedPost);

      // Cập nhật post trong state
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );

      // Đóng modal
      setShowEditModal(false);
      setEditingPost(null);
      message.success("Post updated successfully");
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Failed to save post");
      throw error;
    }
  };

  const handleApprove = async (row) => {
    try {
      await blogService.approvePost(row.id);

      setPosts(
        posts.map((post) =>
          post.id === row.id
            ? { ...post, status: true, updated: new Date().toISOString() }
            : post
        )
      );
      message.success(`Approved post: ${row.title}`);
    } catch (error) {
      console.error("Error approving post:", error);
      message.error("Failed to approve post");
    }
  };

  // Handler for viewing post details
  const handleView = async (row) => {
    try {
      setLoadingPostDetail(true);
      setShowViewModal(true);

      // Fetch detailed post data from API
      const postDetail = await blogService.getPostById(row.id);
      setViewingPost(postDetail);
    } catch (error) {
      console.error("Error fetching post details:", error);
      message.error("Failed to load post details");
      setShowViewModal(false);
    } finally {
      setLoadingPostDetail(false);
    }
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingPost(null);
  };

  const columns = [
    { title: "Post ID", dataIndex: "id" },
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: renderImage,
    },
    { title: "Title", dataIndex: "title" },
    { title: "Author", dataIndex: "author" },
    { title: "Post Type", dataIndex: "postType" },
    {
      title: "Last updated",
      dataIndex: "updated",
      render: (value) => {
        if (!value) return "N/A";
        return dayjs(value).format("DD/MM/YYYY");
      },
    },
    { title: "Status", dataIndex: "status", render: renderStatus },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, row) => {
        if (row.status === true) {
          // Published posts actions
          return (
            <Space size="small">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => handleView(row)}
              >
                Detail
              </Button>
              <Button
                type="default"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(row)}
              >
                Edit
              </Button>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleDelete(row.id, row.title)}
              >
                Delete
              </Button>
            </Space>
          );
        } else {
          // Not published posts actions
          return (
            <Space size="small">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => handleView(row)}
              >
                View
              </Button>
              <Button
                type="default"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(row)}
              >
                Edit
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={() => handleApprove(row)}
              >
                Approve
              </Button>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleDelete(row.id, row.title)}
              >
                Delete
              </Button>
            </Space>
          );
        }
      },
    },
  ];

  // Filter posts by status
  const publishedPosts = filteredPosts.filter((p) => p.status === true);
  const notPublishedPosts = filteredPosts.filter((p) => p.status === false);

  // Section-specific selected posts
  const publishedSelected = selectedPosts.filter((id) =>
    publishedPosts.some((p) => p.id === id)
  );
  const notPublishedSelected = selectedPosts.filter((id) =>
    notPublishedPosts.some((p) => p.id === id)
  );

  // Section-specific bulk action handler
  const handleBulkActionSection = (section) => async (action) => {
    let ids = [];
    if (section === "published") ids = publishedSelected;
    if (section === "notPublished") ids = notPublishedSelected;

    // Handle bulk delete
    if (action === "delete") {
      confirm({
        title: "Delete Multiple Posts",
        icon: <ExclamationCircleOutlined />,
        content: `Are you sure you want to delete ${ids.length} selected posts? This action cannot be undone.`,
        okText: "Yes, Delete All",
        okType: "danger",
        cancelText: "Cancel",
        centered: true,
        onOk: async () => {
          try {
            // Delete multiple posts
            await Promise.all(ids.map((id) => blogService.deletePost(id)));
            setPosts(posts.filter((post) => !ids.includes(post.id)));
            setSelectedPosts(selectedPosts.filter((id) => !ids.includes(id)));
            message.success(`Successfully deleted ${ids.length} posts`);
          } catch (error) {
            console.error("Error deleting posts:", error);
            message.error("Failed to delete selected posts");
          }
        },
      });
    }
    // Handle bulk approve
    else if (action === "approve") {
      try {
        // Approve multiple posts
        await Promise.all(ids.map((id) => blogService.approvePost(id)));
        setPosts(
          posts.map((post) =>
            ids.includes(post.id)
              ? { ...post, status: true, updated: new Date().toISOString() }
              : post
          )
        );
        setSelectedPosts(selectedPosts.filter((id) => !ids.includes(id)));
        message.success(`Successfully approved ${ids.length} posts`);
      } catch (error) {
        console.error("Error approving posts:", error);
        message.error("Failed to approve selected posts");
      }
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <AdminLayout title="Blog Management">
        <div className={styles["blog-management-page"]}>
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
            <p>Loading posts...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Blog Management">
      <div className={styles["blog-management-page"]}>
        <h2>Blog Management</h2>
        <FilterBar
          searchPlaceholder="Search by title, author..."
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          filters={[
            {
              placeholder: "Filter status",
              value: filterStatus,
              onChange: setFilterStatus,
              options: [
                { value: "", label: "All status" },
                { value: true, label: "Published" },
                { value: false, label: "Not Published" },
              ],
            },
          ]}
        />

        {/* Published Section */}
        <h3>Published</h3>
        {publishedSelected.length > 0 && (
          <BulkActionBar
            selectedCount={publishedSelected.length}
            onAction={handleBulkActionSection("published")}
            actions={[{ value: "delete", label: "Delete" }]}
          />
        )}
        {publishedPosts.length === 0 ? (
          <Empty
            description="No published posts"
            style={{ margin: "20px 0" }}
          />
        ) : (
          <ReusableTable
            columns={columns}
            data={publishedPosts}
            selectedRowKeys={publishedSelected}
            onSelectAll={(checked) => {
              const ids = publishedPosts.map((p) => p.id);
              setSelectedPosts(
                checked
                  ? Array.from(new Set([...selectedPosts, ...ids]))
                  : selectedPosts.filter((id) => !ids.includes(id))
              );
            }}
            onSelectRow={(id, checked) =>
              setSelectedPosts((prev) =>
                checked ? [...prev, id] : prev.filter((pid) => pid !== id)
              )
            }
          />
        )}

        {/* Not Published Section */}
        <h3>Not Published</h3>
        {notPublishedSelected.length > 0 && (
          <BulkActionBar
            selectedCount={notPublishedSelected.length}
            onAction={handleBulkActionSection("notPublished")}
            actions={[
              { value: "approve", label: "Approve" },
              { value: "delete", label: "Delete" },
            ]}
          />
        )}
        {notPublishedPosts.length === 0 ? (
          <Empty
            description="No not published posts"
            style={{ margin: "20px 0" }}
          />
        ) : (
          <ReusableTable
            columns={columns}
            data={notPublishedPosts}
            selectedRowKeys={notPublishedSelected}
            onSelectAll={(checked) => {
              const ids = notPublishedPosts.map((p) => p.id);
              setSelectedPosts(
                checked
                  ? Array.from(new Set([...selectedPosts, ...ids]))
                  : selectedPosts.filter((id) => !ids.includes(id))
              );
            }}
            onSelectRow={(id, checked) =>
              setSelectedPosts((prev) =>
                checked ? [...prev, id] : prev.filter((pid) => pid !== id)
              )
            }
          />
        )}

        {/* Edit Post Modal */}
        <EditPostModal
          post={editingPost}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSavePost}
        />

        {/* View Post Modal */}
        <Modal
          open={showViewModal}
          onCancel={handleCloseViewModal}
          footer={null}
          width={800}
          centered
        >
          <h1 className="modal-post-detail">Post Detail</h1>
          {loadingPostDetail ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
              <p>Loading post details...</p>
            </div>
          ) : viewingPost ? (
            <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {/* Post ID */}
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Post ID: </Text>
                <Text>{viewingPost.postId}</Text>
              </div>

              {/* Author */}
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Author: </Text>
                <Text>{viewingPost.user?.profileName || "Unknown"}</Text>
              </div>

              {/* Post Type */}
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Post Type: </Text>
                <Tag color="blue">{viewingPost.postType}</Tag>
              </div>

              {/* Updated Date */}
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Last Updated: </Text>
                <Text>
                  {dayjs(viewingPost.updatedAt).format("DD/MM/YYYY HH:mm")}
                </Text>
              </div>

              {/* Title */}
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Title:</Text>
                <Title
                  level={4}
                  style={{ marginTop: "8px", marginBottom: "0" }}
                >
                  {viewingPost.title}
                </Title>
              </div>

              {/* Image */}
              {viewingPost.imageUrl && (
                <div style={{ marginBottom: "16px" }}>
                  <Text strong>Image:</Text>
                  <div style={{ marginTop: "8px" }}>
                    <Image
                      src={viewingPost.imageUrl}
                      alt="Post Image"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Content:</Text>
                <Paragraph style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>
                  {viewingPost.content}
                </Paragraph>
              </div>
            </div>
          ) : (
            <Empty description="No post data available" />
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;
