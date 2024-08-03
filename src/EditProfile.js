import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';
import './EditProfile.css';

const EditProfile = ({ currentUser, setCurrentUser, setMainContent }) => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [oldProfilePictureURL, setOldProfilePictureURL] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newProfilePictureURL, setNewProfilePictureURL] = useState('');

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setBio(currentUser.bio || '');
      setOldProfilePictureURL(currentUser.profilePicture || '');
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setNewProfilePicture(e.target.files[0]);
      setNewProfilePictureURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const fetchUpdatedUser = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return {
        uid: uid,
        displayName: userDoc.data().displayName,
        bio: userDoc.data().bio,
        profilePicture: userDoc.data().profilePicture,
      };
    }
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    if (!currentUser) {
      console.error("currentUser is undefined");
      return;
    }
  
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('displayName', '==', displayName));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty && querySnapshot.docs[0].id !== currentUser.uid) {
      alert('Display Name is already in use.');
      return;
    }

    if (!displayName) {
      alert('Display Name cannot be empty.');
      return;
    }
  
    let profilePictureURL = oldProfilePictureURL;
  
    if (newProfilePictureURL && newProfilePicture) {
      const profilePictureRef = ref(storage, `uploads/profile/${currentUser.uid}`);
      await uploadBytes(profilePictureRef, newProfilePicture);
      profilePictureURL = await getDownloadURL(profilePictureRef);
    }
  
    const userRef = doc(db, 'users', currentUser.uid);
    const updateData = {
      displayName,
      displayNameLower: displayName.toLowerCase(),
      bio,
    };
  
    if (newProfilePictureURL && newProfilePicture) {
      updateData.profilePicture = profilePictureURL;
    }
  
    await updateDoc(userRef, updateData);
  
    const updatedUser = await fetchUpdatedUser(currentUser.uid);
  
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
  
    setMainContent(<Profile currentUser={currentUser} targetUser={currentUser} setMainContent={setMainContent} />);
  };
  if (currentUser === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-profile-container">
      <h1 className="edit-profile-">Edit Profile</h1>
      {oldProfilePictureURL && (
        <div className="profile-picture-container">
          <h2>Current Profile Picture:</h2>
          <img className="profile-picture-full" src={newProfilePictureURL || oldProfilePictureURL} alt="Profile" />
        </div>
      )}
      <form onSubmit={handleSave}>
        <div className="display-name-container">
          <label>Display Name:</label>
          <input
            className="display-name-input"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className='bio-container'>
          <label>Bio:</label>
          <textarea
            className='bio-input'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className='picture-upload-container'>
          <label>Upload New Profile Picture:</label>
          <input
            className='picture-upload-input'
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;