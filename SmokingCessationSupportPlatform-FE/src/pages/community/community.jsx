import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { Affix, Card, Divider } from "antd";
import "./community.css";
import CommunityPosts from "../../config/communityPost";

function Community() {
  const allPosts = CommunityPosts.filter((post) => post.is_approved);
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title">
          <p>Community</p>
        </div>
        <Divider className="divider" />
        <div className="wrapper__community">
          <h2>Categories</h2>
          <div className="wrapper__community-categories">
            <Card hoverable className="wrapper__community-categories-card">
              <img
                alt="asset"
                className="wrapper__community-categories-card-img"
                src="../src/components/images/communityAsset1.png"
              />
              <h3>Tips</h3>
              <p>Share and discover tips for quitting smoking.</p>
            </Card>
            <Card hoverable className="wrapper__community-categories-card">
              <img
                alt="asset"
                className="wrapper__community-categories-card-img"
                src="../src/components/images/communityAsset2.png"
              />
              <h3>Stories</h3>
              <p>Read inspiring stories from those who have quit.</p>
            </Card>
            <Card hoverable className="wrapper__community-categories-card">
              <img
                alt="asset"
                className="wrapper__community-categories-card-img"
                src="../src/components/images/communityAsset3.png"
              />
              <h3>Others</h3>
              <p>
                Other post categories shared by people that migh be helpful.
              </p>
            </Card>
          </div>
          <Divider className="divider" />
          <div className="wrapper__community-posts">
            {allPosts.map((post) => (
              <div key={post.post_id} className="wrapper__community-posts-card">
                <img
                  alt="post"
                  className="wrapper__community-posts-card-img"
                  src={post.image}
                />
                <div className="wrapper__community-posts-card-content">
                  <h3>{post.post_type}</h3>
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Community;
