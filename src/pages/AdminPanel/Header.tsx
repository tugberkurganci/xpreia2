import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="admin-header">
      <div className="container">
        <div className="header-content">
          <h1> Admin</h1>
          <span className="role-badge">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
