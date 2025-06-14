import "./othersAccount-nav.css";
import { useLocation, useParams } from "react-router-dom";

function OthersAccountNav() {
  const location = useLocation();
  const { userId } = useParams();

  const isActivePage = (path) => {
    if (path === `/users/${userId}`) {
      return location.pathname === `/users/${userId}`;
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="wrapper__profile-nav">
      <a
        href={`/users/${userId}`}
        className={isActivePage(`/users/${userId}`) ? "active" : ""}
      >
        Profile
      </a>
      <a
        href={`/users/${userId}/posts`}
        className={isActivePage(`/users/${userId}/posts`) ? "active" : ""}
      >
        Posts
      </a>
      <a href="/#" className={isActivePage("/#") ? "active" : ""}>
        Badges
      </a>
    </div>
  );
}

export default OthersAccountNav;
