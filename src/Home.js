
import React, { useEffect, useState } from 'react';
import Header from './Header';
import { db, auth, onAuthStateChanged } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import CommunitiesBar from './CommunitiesBar';
import PostFeed from './PostFeed';
import Profile from './Profile';
import './Home.css';

const Home = ({ currentUser, setCurrentUser }) => {
  const [targetUser, setTargetUser] = useState(null);
  const [mainContent, setMainContent] = useState(<PostFeed currentUser={currentUser}  />);
  const [refreshCommunities, setRefreshCommunities] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: userDoc.data().displayName,
            bio: userDoc.data().bio,
            profilePictureUrl: userDoc.data().profilePicture,
            posts: userDoc.data().posts,
          });
          console.log('User data found');
          console.log(userDoc.data());
        }
      } else {
        setCurrentUser(null);
        console.log('No user data found');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setMainContent(<PostFeed currentUser={currentUser} />);
    }
  }, [currentUser]);

    

  const toggleRefreshCommunities = () => {
    setRefreshCommunities(!refreshCommunities);
  };

  const fetchTargetUser = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      setTargetUser({
        uid: userId,
        displayName: userDoc.data().displayName,
        bio: userDoc.data().bio,
        profilePictureUrl: userDoc.data().profilePicture,
        posts: userDoc.data().posts,
      });
    } else {
      setTargetUser(null);
    }
  };

  const handleProfileClick = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = {
        uid: userId,
        displayName: userDoc.data().displayName,
        bio: userDoc.data().bio,
        profilePictureUrl: userDoc.data().profilePicture,
        posts: userDoc.data().posts,
      };
      setTargetUser(userData);
      setMainContent(<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} targetUser={userData} fetchTargetUser={fetchTargetUser} setMainContent={setMainContent} />);
    } else {
      setTargetUser(null);
    }
  };

  return (
    <div>
      {currentUser != null ? (
        <div>
          <Header 
            currentUser={currentUser} 
            onProfileClick={() => handleProfileClick(currentUser.uid)} 
            setMainContent={setMainContent}
            handleProfileClick={handleProfileClick}
            setCurrentUser={setCurrentUser}
            refreshCommunities={toggleRefreshCommunities}
            fetchTargetUser={fetchTargetUser}
          />
          <div className="content-container">
          <CommunitiesBar currentUser={currentUser} fetchTargetUser={fetchTargetUser} setMainContent={setMainContent} setCurrentUser={setCurrentUser} refreshCommunities={toggleRefreshCommunities} />
            <div className="main-content">
              {mainContent}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>Welcome to Our Application</h1>
          <p>Please <a href="/login">log in</a> or <a href="/signup">sign up</a> to continue.</p>
        </div>
      )}
    </div>
  );
};

export default Home;