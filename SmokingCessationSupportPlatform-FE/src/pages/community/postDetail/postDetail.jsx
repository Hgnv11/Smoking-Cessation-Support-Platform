import "./postDetail.css";
import { Affix, Avatar, Empty, Image, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import api from "../../../config/axios";
import { useSelector } from "react-redux";

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);

  const fetchPostDetail = async () => {
    try {
      const response = await api.get(`/post/detail/${postId}`);
      const postData = response.data;
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

  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__post-container">
          <div className="wrapper__post-container-author">
            <Avatar
              src={author?.avatarUrl}
              alt={`${author?.fullName} avatar`}
              onClick={handleAuthorClick}
              className="wrapper__post-container-author-avatar"
            />
            <p
              onClick={handleAuthorClick}
              className="wrapper__post-container-author-username"
            >
              {author?.profileName}
            </p>
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
