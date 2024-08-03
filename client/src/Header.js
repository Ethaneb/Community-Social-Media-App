import React from 'react';
import useLogout from './useLogout';
import Search from './Search';
import PostFeed from './PostFeed';
import CreatePost from './CreatePost';
import './Header.css';

const Header = ({ currentUser, setCurrentUser, fetchTargetUser, onProfileClick, setMainContent, refreshCommunities, handleProfileClick }) => {
  const handleLogout = useLogout();

  const handleHomeClick = () => {
    setMainContent(<PostFeed currentUser={currentUser}/>);
  };

  const handleCreatePostClick = () => {
    setMainContent(<CreatePost currentUser={currentUser} setMainContent={setMainContent}/>);
  };

  return (
    <header className="header">
      <nav>
        <ul>
          <div className="left-buttons">
            <li>
              <button className='nav-button' onClick={handleHomeClick}>Home</button>
            </li>
            <li>
              <button className='nav-button' onClick={onProfileClick}>My Profile</button>
            </li>
            <li>
              <button className='nav-button' onClick={handleCreatePostClick}>Create Post</button>
            </li>
          </div>
          <li className="search-container">
            <Search currentUser={currentUser} fetchTargetUser={fetchTargetUser} setCurrentUser={setCurrentUser} refreshCommunities={refreshCommunities} handleProfileClick={handleProfileClick} setMainContent={setMainContent} />
          </li>
          <li className="logout-container">
            <button className='nav-button' onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;