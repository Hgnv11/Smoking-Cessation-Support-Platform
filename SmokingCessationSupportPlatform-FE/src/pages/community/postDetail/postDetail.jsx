import { Affix, Avatar, Empty, Image } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./postDetail.css";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import CommunityPosts from "../../../config/communityPost";
import UsersData from "../../../config/userData";

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const foundPost = CommunityPosts.find(
      (p) => p.post_id === parseInt(postId)
    );
    setPost(foundPost);

    if (foundPost) {
      const foundUser = UsersData.find((u) => u.user_id === foundPost.user_id);
      setAuthor(foundUser);
    }
  }, [postId]);

  if (!post || !author) {
    return (
      <>
        <Affix offsetTop={0}>
          <Header />
        </Affix>
        <Empty className="empty-post" description="Post Not Found" />
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
              src={author.avatar_url}
              alt={`${author.full_name} avatar`}
              onClick={() =>
                navigate(`/users/${encodeURIComponent(author.profile_name)}`)
              }
              className="wrapper__post-container-author-avatar"
            />
            <p
              onClick={() =>
                navigate(`/users/${encodeURIComponent(author.profile_name)}`)
              }
              className="wrapper__post-container-author-username"
            >
              {author.profile_name}
            </p>
          </div>
          <div className="wrapper__post-container-detail">
            <Image
              src={post.image}
              alt={post.title}
              className="wrapper__post-container-detail-img"
            />
            <p className="wrapper__post-container-detail-type">
              {post.post_type}
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
