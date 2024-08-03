// client/src/CommunityPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion , deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import CommunityFeed from './CommunityFeed';
import './CommunityPage.css';
import CreatePost from './CreatePost';

const CommunityPage = ({ currentUser, community: propCommunity , setCurrentUser, setMainContent, searchId , refreshCommunities}) => {
  const { communityId: paramCommunityId } = useParams();
  const [community, setCommunity] = useState(propCommunity || null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const communityId = propCommunity ? propCommunity.id : searchId || paramCommunityId;

  useEffect(() => {
    const fetchCommunity = async () => {
      if (!currentUser || !communityId || propCommunity) return;

      const communityRef = doc(db, 'communities', communityId);
      const communitySnap = await getDoc(communityRef);

      if (communitySnap.exists()) {
        const communityData = communitySnap.data();
        setCommunity({ id: communitySnap.id, ...communityData });
        setIsMember(communityData.members.includes(currentUser.uid));
        setIsAdmin(communityData.admin === currentUser.uid || communityData.createdBy === currentUser.displayName);
      }
    };

    if (!propCommunity) {
      fetchCommunity();
    } else {
      setIsMember(propCommunity.members.includes(currentUser.uid));
      setIsAdmin(propCommunity.admin === currentUser.uid || propCommunity.createdBy === currentUser.displayName);
    }
  }, [communityId, currentUser, propCommunity]);

  const handleJoinCommunity = async () => {
    const communityRef = doc(db, 'communities', community.id);
    await updateDoc(communityRef, {
      members: arrayUnion(currentUser.uid)
    });
    setIsMember(true);
    refreshCommunities(); 
  };

  const handleLeaveCommunity = async () => {
    const communityRef = doc(db, 'communities', community.id);
    await updateDoc(communityRef, {
      members: arrayRemove(currentUser.uid)
    });
    setIsMember(false);
    refreshCommunities();
  };
  const handleCreatePostClick = () => {
    setMainContent(<CreatePost currentUser={currentUser} communityId={communityId} setMainContent={setMainContent} />);
  };

  const handleDeleteCommunity = async () => {
    const communityRef = doc(db, 'communities', community.id);
    const postsRef = collection(db, 'posts');

    const q = query(postsRef, where('communityId', '==', community.id));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map(postDoc => deleteDoc(postDoc.ref));
    await Promise.all(deletePromises);

    await deleteDoc(communityRef);

    setMainContent(<div>Community deleted successfully.</div>);
    refreshCommunities();
  };

  if (!community) {
    return <div>Loading...</div>;
  }

  return (
    <div className="community-page">
      <div className="community-header">
        <h1 className="community-title">{community.name}</h1>
        <p className="community-description">{community.description}</p>
      </div>
      <div className="community-actions">
        {!isMember && (
          <button className="community-action-button" onClick={handleJoinCommunity}>Join Community</button>
        )}
        {isMember && !isAdmin && (
          <button className="community-action-button" onClick={handleLeaveCommunity}>Leave Community</button>
        )}
        {isMember && (
          <button className="community-action-button" onClick={handleCreatePostClick}>
            Create Post in {community.name}
          </button>
        )}
        {isAdmin && (
          <button className="community-action-button delete-button" onClick={handleDeleteCommunity}>
            Delete Community
          </button>
        )}
      </div>
      <CommunityFeed communityId={community.id} setCurrentUser={setCurrentUser} currentUser={currentUser} showCommunityName={false} />
    </div>
  );
};

export default CommunityPage;