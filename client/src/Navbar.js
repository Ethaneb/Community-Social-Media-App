import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/userprofile">My Profile</Link></li>
        <li><Link to="/CreatePost">Create Post</Link></li>
        <li><Link to="/CreateCommunity">Create Community</Link></li>
        <li><Link to="/postfeed">Post Feed</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;