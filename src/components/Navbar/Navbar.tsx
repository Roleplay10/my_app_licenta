// src/components/Navbar/Navbar.tsx

import React, { useState, useRef } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/uoc_logo.png';
import profile_pic from '../../assets/images/user.png';
import ProfileMenu from './ProfileMenu/ProfileMenu';
import settings_pic from '../../assets/images/settings.png';
import logout_pic from '../../assets/images/log-out.png';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

const Navbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(true);
  };

  const logOut = () => {
    signOut();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 50);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Universitatea Ovidius" />
          </Link>
        </div>
        <div className="navbar-buttons">
          <Link to="/announcements">Announcements</Link>
          <Link to="/admission">Admission</Link>
        </div>
      </div>
      <div className="navbar-right">
        <ul className="navbar-links">
          {isAuthenticated && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          <li>
            <div
              className="profile-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="profile-trigger">
                <img className="profile_pic" src={profile_pic} alt="Profile" />
              </div>
              <div className={`profile-menu ${visible ? 'visible' : ''}`}>
                {isAuthenticated ? (
                  <>
                    <h3>Student</h3>
                    <ul>
                      <ProfileMenu img={settings_pic} text={'Settings'} location="/settings" />
                      <ProfileMenu img={logout_pic} text={'Logout'} location="/" onClick={logOut} />
                    </ul>
                  </>
                ) : (
                  <ul>
                    <ProfileMenu img={logout_pic} text={'Login'} location="/login" />
                  </ul>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
