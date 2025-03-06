import React from "react";
import { Bell, Settings } from "lucide-react";
import "../styles/header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
     
      <div className="header-heading">
        <h1>AgamHive</h1>
      </div>

      
      <div className="header-right">
        <Settings className="header-icon" />
        <Bell className="header-icon" />

       
        <div className="header-profile">
          <img
            src="/images/profile.png"
            alt="User Profile"
            className="profile-image"
          />
          <div className="profile-info">
            <span className="user-name">Jhon Wick</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
