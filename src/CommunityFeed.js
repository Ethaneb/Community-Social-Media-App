import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Post from './Post';
import './CommunityFeed.css';

const CommunityFeed = ({ communityId, currentUser, setCurrentUser, fetchCurrentUser, showCommunityName = true }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('communityId', '==', communityId));
        const querySnapshot = await getDocs(q);
        const communityPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setPosts(communityPosts);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
      }
    };

    fetchCommunityPosts();
  }, [communityId]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="community-feed-container">
      <h1 className="community-feed-title">Community Feed</h1>
      {posts.length > 0 ? (
        <div className="community-feed-posts">
          {posts.map(post => (
            <Post
              key={post.id}
              currentUser={currentUser}
              fetchCurrentUser={fetchCurrentUser}
              setCurrentUser={setCurrentUser}
              post={post}
              showDisplayName={true}
              showCommunityName={false}
            />
          ))}
        </div>
      ) : (
        <p className="community-feed-no-posts">No posts available</p>
      )}
    </div>
  );
};

export default CommunityFeed;