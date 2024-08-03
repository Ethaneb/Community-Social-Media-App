import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Post from './Post';
import './PostFeed.css';

const PostFeed = ( {currentUser}) => {
  const [content, setContent] = useState([]);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        const following = userDoc.data().following || [];

        if (following.length === 0) {
          setContent([]);
          return;
        }

        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', 'in', following));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setContent(posts);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
      }
    };

    fetchPosts();
  }, [currentUser]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="post-feed-container">
      <h1 className="post-feed-title">Following</h1>
      <div className="post-feed-posts">
      {content.length > 0 ? (
        content.map(post => (
          <Post className="post-feed-post" key={post.id} post={post} showCommunityName={true} showDisplayName={true} currentUser={currentUser} />
        ))
      ) : (
        <p>No posts available</p>
      )}
      </div>
    </div>
  );
};

export default PostFeed;