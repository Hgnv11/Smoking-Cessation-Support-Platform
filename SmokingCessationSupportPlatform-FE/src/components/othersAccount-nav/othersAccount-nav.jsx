import "./othersAccount-nav.css";
import { useLocation, useParams } from "react-router-dom";

function OthersAccountNav() {
  const location = useLocation();
  const { profileName } = useParams();

  const isActivePage = (path) => {
    if (path === `/users/${encodeURIComponent(profileName)}`) {
      return location.pathname === `/users/${encodeURIComponent(profileName)}`;
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="wrapper__profile-nav">
      <a
        href={`/users/${encodeURIComponent(profileName)}`}
        className={
          isActivePage(`/users/${encodeURIComponent(profileName)}`)
            ? "active"
            : ""
        }
      >
        Profile
      </a>
      <a
        href={`/users/${encodeURIComponent(profileName)}/posts`}
        className={
          isActivePage(`/users/${encodeURIComponent(profileName)}/posts`)
            ? "active"
            : ""
        }
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
