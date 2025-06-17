import "./userPosts.css";
import { Affix, Button } from "antd";
import Footer from "../../../../components/footer/footer";
import Header from "../../../../components/header/header";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

function UserPosts() {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title1">
          <p>My Account</p>
        </div>
        <div className="wrapper__profile">
          <MyAccountNav />
          <div className="wrapper__community-posts">
            <h1 className="wrapper__community-posts-title">Posts</h1>
            <Button color="default" variant="filled" className="new-post-btn">
              <PlusOutlined />
              New Post
            </Button>
            {/* {userPosts.length === 0 ? (
              <Empty
                className="empty-posts"
                description={`${user.profile_name} hasn't posted anything yet`}
              />
            ) : (
              <div className="wrapper__community-posts-container">
                {userPosts.map((post) => (
                  <div
                    key={post.post_id}
                    className="wrapper__community-posts-card"
                  >
                    <img
                      alt="post"
                      className="wrapper__community-posts-card-img"
                      src={post.image}
                      onClick={() => navigate(`/community/${post.post_id}`)}
                    />
                    <div className="wrapper__community-posts-card-content">
                      <h3>{post.post_type}</h3>
                      <h2
                        onClick={() => navigate(`/community/${post.post_id}`)}
                      >
                        {post.title}
                      </h2>
                      <p onClick={() => navigate(`/community/${post.post_id}`)}>
                        {post.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )} */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserPosts;
