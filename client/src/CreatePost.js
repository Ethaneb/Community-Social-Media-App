import React, { useState, useEffect } from 'react';
import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import Profile from './Profile';
import './CreatePost.css';

const CreatePost = ({ currentUser, communityId, setMainContent}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [communityName, setCommunityName] = useState('');

  useEffect(() => {
    if (communityId) {
      const fetchCommunityName = async () => {
        const communityRef = doc(db, 'communities', communityId);
        const communitySnap = await getDoc(communityRef);
        if (communitySnap.exists()) {
          setCommunityName(communitySnap.data().name);
        }
      };
      fetchCommunityName();
    }
  }, [communityId]);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (!currentUser) return;
  
    let imageUrl = '';
    if (image) {
      const imageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}-${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }
    
  
    const postData = {
      title,
      content,
      imageUrl,
      userId: currentUser.uid,
      displayName: currentUser.displayName, 
      createdAt: new Date(),
      likes: [],
      comments: [],
    };

    if (communityId) {
      postData.communityId = communityId;
      postData.communityName = communityName;
    }
  
    const postRef = await addDoc(collection(db, 'posts'), postData);
  
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      posts: arrayUnion(postRef.id),
    });
  
    setMainContent(<Profile currentUser={currentUser} targetUser={currentUser} />);
  };

  if (!currentUser) {
    return (
      <div>
        <h1>You must be logged in to create a post.</h1>
        <p>Please <a href="/login">log in</a> or <a href="/signup">sign up</a> to continue.</p>
      </div>
    );
  }

  return (
    <div className="create-post-container">
    <h1 className="create-post-title">Create a New Post {communityName && `in ${communityName}`}</h1>
    <form className="create-post-form" onSubmit={handleCreatePost}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="image">Upload Image</label>
        <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button className="create-post-button" type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;