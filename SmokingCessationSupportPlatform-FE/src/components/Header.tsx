import React from 'react';
import { Layout, Menu, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const items: MenuProps['items'] = [
    {
      key: 'home',
      label: 'Home',
    },
    {
      key: 'mentor',
      label: 'Mentor/Coach',
    },
    {
      key: 'community',
      label: 'Community',
    },
    {
      key: 'about',
      label: 'About us',
    },
  ];

  return (
    <AntHeader className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-text">QuitIt</span>
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          items={items}
          className="header-menu"
        />
        <Space className="header-actions">
          <SearchOutlined className="search-icon" />
          <Button type="text" className="login-btn">Login</Button>
          <Button type="primary" className="signup-btn">Sign up</Button>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;