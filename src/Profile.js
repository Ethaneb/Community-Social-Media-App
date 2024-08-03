import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { followUser, unfollowUser } from './followUtils';
import Post from './Post';
import EditProfile from './EditProfile';

const Profile = ({ currentUser, targetUser, fetchTargetUser, setMainContent, setCurrentUser}) => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchTargetUser(userId);
    }
  }, [userId, fetchTargetUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (targetUser && targetUser.uid && currentUser) {
        try {
          const postsRef = collection(db, 'posts');
          const q = query(postsRef, where('userId', '==', targetUser.uid));
          const querySnapshot = await getDocs(q);
          const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(userPosts);
  
          const userRef = doc(db, 'users', targetUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFollowing(userData.following || []);
            setFollowers(userData.followers || []);
            setIsFollowing(userData.followers.includes(currentUser.uid));
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchData();
  }, [targetUser, currentUser]);

  const handleFollow = async () => {
    try {
      await followUser(currentUser.uid, targetUser.uid);
      setIsFollowing(true);
      setFollowers([...followers, currentUser.uid]);
    } catch (error) {
      console.error("Error following user: ", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(currentUser.uid, targetUser.uid);
      setIsFollowing(false);
      setFollowers(followers.filter(id => id !== currentUser.uid));
    } catch (error) {
      console.error("Error unfollowing user: ", error);
    }
  };

  const handleEditProfile = () => {
    setMainContent(<EditProfile currentUser={currentUser} setMainContent={setMainContent} setCurrentUser={setCurrentUser}/>);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!targetUser) {
    return <div>User not found</div>;
  }

  const { bio, displayName, profilePictureUrl } = targetUser;
  const isCurrentUser = currentUser && currentUser.uid === targetUser.uid;

  return (
    <div className="profile-container">
      {profilePictureUrl ? (
        <img className="profile-picture-full" src={profilePictureUrl} alt="Profile" />
      ) : (
        <p>No profile picture available</p>
      )}
      <h1>{displayName}</h1>
      <p>{bio}</p>

      {isCurrentUser ? (
        <button onClick={handleEditProfile}>Edit Profile</button>
      ) : (
        isFollowing ? (
          <button onClick={handleUnfollow}>Unfollow</button>
        ) : (
          <button onClick={handleFollow}>Follow</button>
        )
      )}

      <div className="follow-info">
        <div className="following">
          <h2>Following: {following.length}</h2>
        </div>
        <div className="followers">
          <h2>Followers: {followers.length}</h2>
        </div>
      </div>
      <div className="profile-posts">
      <h2 className="post-header">Posts</h2>
        {posts.length > 0 ? (
          posts.map(post => (
            <Post key={post.id} post={post} showDisplayName={false} showCommunityName={true} currentUser={currentUser} />
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;