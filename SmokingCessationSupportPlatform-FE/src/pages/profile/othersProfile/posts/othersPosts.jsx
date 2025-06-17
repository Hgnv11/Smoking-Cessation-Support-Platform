import { Affix, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../../../../components/footer/footer";
import Header from "../../../../components/header/header";
import OthersAccountNav from "../../../../components/othersAccount-nav/othersAccount-nav";
import UsersData from "../../../../config/userData";
import CommunityPosts from "../../../../config/communityPost";
import "./othersPosts.css";

function OthersPosts() {
  const { profileName } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const decodedProfileName = decodeURIComponent(profileName);

    const foundUser = UsersData.find(
      (u) => u.profile_name === decodedProfileName
    );
    setUser(foundUser);

    if (foundUser) {
      const posts = CommunityPosts.filter(
        (post) => post.user_id === foundUser.user_id
      );
      setUserPosts(posts);
    }
  }, [profileName]);

  if (!user) {
    return (
      <>
        <Affix offsetTop={0}>
          <Header />
        </Affix>
        <Empty className="empty-user" description="User Not Found" />
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
        <div className="wrapper__title1">
          <p>{user.profile_name}'s Account</p>
        </div>
        <div className="wrapper__profile">
          <OthersAccountNav />
          <div className="wrapper__community-posts">
            <h1 className="wrapper__community-posts-title">Posts</h1>
            {userPosts.length === 0 ? (
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OthersPosts;
