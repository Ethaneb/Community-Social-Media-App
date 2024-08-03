import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, onAuthStateChanged, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import PostFeed from './PostFeed';
import Profile from './Profile';
import EditProfile from './EditProfile';
import CreateCommunity from './CreateCommunity';
import Search from './Search';
import SearchResultsPage from './SearchResultsPage';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<SignUp setCurrentUser={setCurrentUser} />} />
        <Route path="/userprofile" element={<Profile currentUser={currentUser} targetUser={currentUser} fetchTargetUser={fetchTargetUser} />} />
        <Route path="CreateCommunity" element={<CreateCommunity currentUser={currentUser} />} />
        <Route path="/search" element={<Search />} />
        <Route path="/searchresults" element={<SearchResultsPage />} />
        <Route path="/postfeed" element={<PostFeed currentUser={currentUser} fetchTargetUser={fetchTargetUser} />} />
        <Route path="/edit-profile/:userId" element={<EditProfile currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
      </Routes>
    </Router>
  );
};

export default App;