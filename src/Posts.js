import React, { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, query, where, getDocs, getDoc } from 'firebase/firestore';

const Post = ({ post, currentUser }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userDetails, setUserDetails] = useState({});

  const fetchComments = useCallback(async () => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', post.id));
    const querySnapshot = await getDocs(q);
    const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(commentsData);

    // Fetch user details for each comment
    const userDetailsPromises = commentsData.map(async (comment) => {
      const userRef = doc(db, 'users', comment.userId);
      const userDoc = await getDoc(userRef);
      return { userId: comment.userId, displayName: userDoc.data().displayName };
    });

    const userDetailsArray = await Promise.all(userDetailsPromises);
    const userDetailsMap = userDetailsArray.reduce((acc, user) => {
      acc[user.userId] = user.displayName;
      return acc;
    }, {});

    setUserDetails(userDetailsMap);
  }, [post.id]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, fetchComments]);

  const handleLike = async () => {
    const postRef = doc(db, 'posts', post.id);
    if (likes.includes(currentUser.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser.uid),
      });
      setLikes(likes.filter(uid => uid !== currentUser.uid));
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser.uid),
      });
      setLikes([...likes, currentUser.uid]);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const commentRef = await addDoc(collection(db, 'comments'), {
      postId: post.id,
      userId: currentUser.uid,
      content: newComment,
      createdAt: new Date(),
    });
    setComments([...comments, { id: commentRef.id, userId: currentUser.uid, content: newComment }]);
    setNewComment('');
  };

  return (
    <div>
      <h2>{post.title}</h2>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
      <p>{post.content}</p>
      <button onClick={handleLike}>
        {likes.includes(currentUser.uid) ? 'Unlike' : 'Like'} ({likes.length})
      </button>
      <button onClick={() => setShowComments(!showComments)}>
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
      {showComments && (
        <div>
          {comments.map(comment => (
            <div key={comment.id}>
              <strong>{userDetails[comment.userId] || comment.userId}</strong>: {comment.content}
            </div>
          ))}
          <form onSubmit={handleAddComment}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              required
            />
            <button type="submit">Comment</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;