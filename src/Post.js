// client/src/Post.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './Post.css';

const Post = ({ post, currentUser, setCurrentUser, fetchTargetUser, showCommunityName = true, showDisplayName = true }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0); 

  useEffect(() => {
    const fetchComments = async () => {
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('postId', '==', post.id));
      const querySnapshot = await getDocs(q);
      const postComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(postComments);
      setCommentCount(postComments.length);
    };

    if (showComments) {
      fetchComments();
    }
  }, [showComments, post.id]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('postId', '==', post.id));
      const querySnapshot = await getDocs(q);
      const postComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(postComments);
      setCommentCount(postComments.length);
    }; 

    fetchComments();
  }, [post.id]);

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
      displayName: currentUser.displayName,
      content: newComment,
      createdAt: new Date(),
    });
    setComments([...comments, { id: commentRef.id, userId: currentUser.uid, displayName: currentUser.displayName, content: newComment }]);
    setNewComment('');
    setCommentCount(commentCount + 1);
  };

  return (
    <div className="post-card">
      {showCommunityName && post.communityName && (
        <div className="post-community">
          Posted to: <strong>{post.communityName}</strong>
        </div>
      )}
      <div className="post-header">
        <h2 className="post-title">{post.title}</h2>
        {showDisplayName && (
          <div className="post-author">
            User: <strong>{post.displayName}</strong>
          </div>
        )}
      </div>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="post-image" />}
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <button onClick={handleLike}>
          {likes.includes(currentUser.uid) ? 'Unlike' : 'Like'} ({likes.length})
        </button>
        <button onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Hide Comments' : 'Comments'} ({commentCount})
        </button>
      </div>
      {showComments && (
        <div className="post-comments">
          {comments.map(comment => (
            <div key={comment.id} className="post-comment">
              <strong>{comment.displayName}</strong>: {comment.content}
            </div>
          ))}
          <form onSubmit={handleAddComment} className="post-comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              required
              className="post-comment-input"
            />
            <button type="submit" className="post-comment-button">Add Comment</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;