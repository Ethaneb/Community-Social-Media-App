import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import CommunityPage from './CommunityPage';
import './CreateCommunity.css';

const CreateCommunity = ({ currentUser, setMainContent, refreshCommunities }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const docRef = await addDoc(collection(db, 'communities'), {
      name,
      nameLower: name.toLowerCase(),
      description,
      createdBy: currentUser.displayName,
      admin: currentUser.uid,
      members: [currentUser.uid],
    });

    const newCommunity = {
      id: docRef.id,
      name,
      description,
      createdBy: currentUser.displayName,
      admin: currentUser.uid,
      members: [currentUser.uid],
    };

    setMainContent(<CommunityPage community={newCommunity} currentUser={currentUser} setMainContent={setMainContent} refreshCommunities={refreshCommunities} />);
    refreshCommunities();
  };

  return (
    <div className="create-community-container">
      <h1 className="create-community-title">Create Community</h1>
      <form className="create-community-form" onSubmit={handleCreateCommunity}>
        <div className="form-group">
          <label htmlFor="community-name">Community Name</label>
          <input
            id="community-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Community Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="community-description">Community Description</label>
          <textarea
            id="community-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Community Description"
            required
          />
        </div>
        <button className="create-community-button" type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateCommunity;