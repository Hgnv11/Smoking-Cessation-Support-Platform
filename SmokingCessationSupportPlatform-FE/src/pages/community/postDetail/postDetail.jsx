import "./postDetail.css";
import {
  Affix,
  Avatar,
  Button,
  Empty,
  Image,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  Upload,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import { useSelector } from "react-redux";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../store/utils/file";
import TextArea from "antd/es/input/TextArea";
import FormItem from "antd/es/form/FormItem";

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);

  const fetchPostDetail = async () => {
    try {
      const response = await api.get(`/post/detail/${postId}`);
      const postData = response.data;

      if (!postData.isApproved) {
        setPost(null);
        return;
      }
      setPost(postData);

      if (postData.user?.profileName) {
        try {
          const response = await api.get(
            `/profile/by-name/${postData.user.profileName}`
          );
          setAuthor(response.data);
        } catch (authorError) {
          console.error("Error fetching author:", authorError);
        }
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
      message.error("Failed to fetch post details. Please try again later.");
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
    }
  }, [postId]);

  const handleAuthorClick = () => {
    if (author?.profileName === user?.profileName) {
      navigate("/user-profile");
    } else {
      navigate(`/users/${encodeURIComponent(author?.profileName)}`);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await api.delete(`/post/${postId}`);

      if (response.status === 200 || response.status === 204) {
        message.success("Post deleted successfully!");
        navigate("/community");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Failed to delete post. Please try again.");
    }
  };

  if (!post) {
    return (
      <>
        <Affix offsetTop={0}>
          <Header />
        </Affix>
        <div className="wrapper">
          <Empty className="empty-post" description="Post Not Found" />
        </div>
        <Footer />
      </>
    );
  }

  const handleOpenUpdateModal = () => {
    form.setFieldsValue({
      title: post.title,
      postType: post.postType,
      content: post.content,
    });

    // Set existing image if available
    if (post.imageUrl) {
      setFileList([
        {
          uid: "-1",
          name: "current-image",
          status: "done",
          url: post.imageUrl,
        },
      ]);
    }

    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    form.resetFields();
    setFileList([]);
  };

  const handleUpdatePost = async (values) => {
    try {
      setLoading(true);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        try {
          const uploadedImageUrl = await uploadFile(fileList[0].originFileObj);
          values.imageUrl = uploadedImageUrl;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          message.error("Failed to upload image. Please try again.");
          return;
        }
      } else if (fileList.length > 0 && fileList[0].url) {
        // Keep existing image
        values.imageUrl = fileList[0].url;
      }

      const response = await api.put(`/post/${postId}`, values);

      if (response.status === 200) {
        message.success("Updated post is sent for approval!");
        handleCloseUpdateModal();
        // Refresh post data
        await fetchPostDetail();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    if (!isLt5M) {
      message.error("Image must smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }

    return false; // Prevent auto upload
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleFinishFailed = () => {
    setLoading(false);
  };

  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__post-container">
          <div className="wrapper__post-container-author">
            <div className="wrapper__post-container-author-info">
              {author?.avatarUrl ? (
                <Avatar
                  src={author.avatarUrl}
                  alt={`${author.fullName} avatar`}
                  onClick={handleAuthorClick}
                  className="wrapper__post-container-author-avatar"
                />
              ) : (
                <Avatar
                  className="wrapper__post-container-author-avatar"
                  icon={
                    <UserOutlined className="wrapper__post-container-author-avatar-UserOutlined" />
                  }
                />
              )}
              <p
                onClick={handleAuthorClick}
                className="wrapper__post-container-author-username"
              >
                {author?.profileName}
              </p>
            </div>

            {author?.userId === user?.userId && (
              <div className="wrapper__post-container-author-actions">
                <Button
                  className="wrapper__post-container-author-actions-btn"
                  color="primary"
                  variant="solid"
                  onClick={handleOpenUpdateModal}
                >
                  Update
                </Button>

                <Modal
                  open={openUpdateModal}
                  onCancel={handleCloseUpdateModal}
                  footer={[
                    <Button key="cancel" onClick={handleCloseUpdateModal}>
                      Cancel
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      loading={loading}
                      onClick={() => {
                        setLoading(true);
                        form.submit();
                      }}
                    >
                      Update
                    </Button>,
                  ]}
                >
                  <h1 className="wrapper__community-posts-create">
                    Update Your Post
                  </h1>
                  <Form
                    onFinish={handleUpdatePost}
                    onFinishFailed={handleFinishFailed}
                    form={form}
                  >
                    <p className="wrapper__community-posts-create-label">
                      Title
                    </p>
                    <FormItem
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the title of post.",
                        },
                      ]}
                    >
                      <Input
                        variant="filled"
                        className="wrapper__community-posts-create-input"
                        placeholder="Enter the post's title"
                      />
                    </FormItem>

                    <p className="wrapper__community-posts-create-label">
                      Category
                    </p>
                    <FormItem
                      name="postType"
                      rules={[
                        {
                          required: true,
                          message: "Please select the type of post.",
                        },
                      ]}
                    >
                      <Select
                        className="wrapper__community-posts-create-category"
                        variant="filled"
                        allowClear
                        options={[
                          {
                            value: "tips",
                            label: "TIPS",
                          },
                          {
                            value: "stories",
                            label: "STORIES",
                          },
                          {
                            value: "other",
                            label: "OTHER",
                          },
                        ]}
                        placeholder="Select the post's category"
                      />
                    </FormItem>

                    <p className="wrapper__community-posts-create-label">
                      Content
                    </p>
                    <FormItem
                      name="content"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the content of post.",
                        },
                      ]}
                    >
                      <TextArea
                        className="wrapper__community-posts-create-textarea"
                        variant="filled"
                        placeholder="Enter the post's content"
                        autoSize={{ minRows: 10, maxRows: 15 }}
                      />
                    </FormItem>

                    <p className="wrapper__community-posts-create-label">
                      Update Image
                    </p>
                    <FormItem name="imageUrl">
                      <Upload
                        listType="picture"
                        maxCount={1}
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={beforeUpload}
                      >
                        <Button
                          color="default"
                          variant="filled"
                          icon={<UploadOutlined />}
                        >
                          Upload (Max 1)
                        </Button>
                      </Upload>
                    </FormItem>
                  </Form>
                </Modal>

                <Popconfirm
                  title="Do you want to delete this post ?"
                  okText="Delete"
                  cancelText="No"
                  onConfirm={handleDeletePost}
                >
                  <Button
                    className="wrapper__post-container-author-actions-btn"
                    color="danger"
                    variant="solid"
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
          <div className="wrapper__post-container-detail">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                className="wrapper__post-container-detail-img"
              />
            )}
            <p className="wrapper__post-container-detail-type">
              {post.postType?.toUpperCase()}
            </p>
            <h1 className="wrapper__post-container-detail-img-title">
              {post.title}
            </h1>
            <p className="wrapper__post-container-detail-content">
              {post.content}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PostDetail;
