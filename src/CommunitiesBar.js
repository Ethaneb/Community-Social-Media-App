import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CreateCommunity from './CreateCommunity';
import CommunityPage from './CommunityPage';
import './CommunitiesBar.css';

const CommunitiesBar = ({ currentUser, setMainContent, setCurrentUser, refreshCommunities }) => {
  const [communities, setCommunities] = useState([]);
  const [joinableCommunities, setJoinableCommunities] = useState([]);
  const [showJoinable, setShowJoinable] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, 'communities'),
        where('members', 'array-contains', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const userCommunities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(Array.isArray(userCommunities) ? userCommunities : []);
    };

    const fetchJoinableCommunities = async () => {
      if (!currentUser) return;

      const q = query(collection(db, 'communities'));
      const querySnapshot = await getDocs(q);
      const allCommunities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const joinable = allCommunities;
      setJoinableCommunities(joinable);
    };


    fetchCommunities()
    fetchJoinableCommunities();
  }, [currentUser, refreshCommunities]);

  if (!currentUser) {
    return null;
  }

  const handleCommunityClick = (community) => {
    setMainContent(
      <CommunityPage
        key={community.id}
        community={community}
        currentUser={currentUser}
        setMainContent={setMainContent}
        refreshCommunities={refreshCommunities}
        setCurrentUser={setCurrentUser}
      />
    );
  };

  const handleCreateCommunityClick = () => {
    setMainContent(<CreateCommunity currentUser={currentUser} setMainContent={setMainContent} refreshCommunities={refreshCommunities} />);
  };

  const toggleJoinableCommunities = () => {
    setShowJoinable(!showJoinable);
  };

  return (
    <div className="communities-bar">
      <h2 className="community-bar-title">Your Communities</h2>
      <ul>
        {communities.map(community => (
          <li className="community-bar-item" key={community.id} onClick={() => handleCommunityClick(community)}>
            {community.name}
          </li>
        ))}
      </ul>
      <button className="community-bar-create-button" onClick={handleCreateCommunityClick}>Create Community</button>
      <button className="community-bar-toggle-button" onClick={toggleJoinableCommunities}>
        {showJoinable ? 'Hide all communities' : 'Show all communities'}
      </button>
      {showJoinable && (
        <ul className="joinable-communities-list">
          {joinableCommunities.map(community => (
            <li className="joinable-community-item" key={community.id} onClick={() => handleCommunityClick(community)}>
              {community.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommunitiesBar;