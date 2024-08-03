import { db } from './firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const joinCommunity = async (communityId, userId) => {
  const communityRef = doc(db, 'communities', communityId);
  await updateDoc(communityRef, {
    members: arrayUnion(userId),
  });
};

export const followUser = async (currentUserId, targetUserId) => {
  const currentUserRef = doc(db, 'users', currentUserId);
  const targetUserRef = doc(db, 'users', targetUserId);

  await updateDoc(currentUserRef, {
    following: arrayUnion(targetUserId),
  });

  await updateDoc(targetUserRef, {
    followers: arrayUnion(currentUserId),
  });
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  const currentUserRef = doc(db, 'users', currentUserId);
  const targetUserRef = doc(db, 'users', targetUserId);

  await updateDoc(currentUserRef, {
    following: arrayRemove(targetUserId),
  });

  await updateDoc(targetUserRef, {
    followers: arrayRemove(currentUserId),
  });
};