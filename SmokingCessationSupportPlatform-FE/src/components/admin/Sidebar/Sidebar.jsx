import React from "react";
import { NavLink } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  ReadOutlined,
  TeamOutlined,
  CreditCardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar__logo">
          <div className="sidebar__admin-name">Admin QuitIt</div>
        </div>
        <nav>
          <div className="sidebar__section-title">Dashboards</div>
          <ul className="sidebar__menu">
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar__menu-item sidebar__menu-item--active"
                    : "sidebar__menu-item"
                }
                end
              >
                <DashboardOutlined className="sidebar__icon" />
                Overview
              </NavLink>
            </li>
          </ul>
          <div className="sidebar__section-title sidebar__section-title--pages">
            Pages
          </div>
          <ul className="sidebar__menu">
            <li>
              <NavLink
                to="/admin/user-management"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar__menu-item sidebar__menu-item--active"
                    : "sidebar__menu-item"
                }
              >
                <UserOutlined className="sidebar__icon" />
                User Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/blog-management"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar__menu-item sidebar__menu-item--active"
                    : "sidebar__menu-item"
                }
              >
                <ReadOutlined className="sidebar__icon" />
                Blog Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/coach-management"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar__menu-item sidebar__menu-item--active"
                    : "sidebar__menu-item"
                }
              >
                <TeamOutlined className="sidebar__icon" />
                Coach Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/membership-payment"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar__menu-item sidebar__menu-item--active"
                    : "sidebar__menu-item"
                }
              >
                <CreditCardOutlined className="sidebar__icon" />
                Membership & Payment
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar__logout">
        <button className="sidebar__logout-btn">
          <LogoutOutlined className="sidebar__icon" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
