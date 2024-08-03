import React, { useState } from 'react';
import { auth, db, storage } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const generateRandomDisplayName = () => {
    return `User${Math.floor(Math.random() * 10000)}`;
  };

  const handleSignUp = async (e) => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const finalDisplayName = displayName || generateRandomDisplayName();

      await setDoc(doc(db, 'users', user.uid), {
        displayName: finalDisplayName,
        displayNameLower: finalDisplayName.toLowerCase(),
        bio: "",
        profilePicture: "",
        posts: [], 
        following: [], 
        followers: [], 
      });

      setCurrentUser(user);
      alert('Sign up successful');
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="sign-up-container">
      <h1 className="sign-up-title">Sign Up</h1>
      <form className="sign-up-form" onSubmit={handleSignUp}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="sign-up-button">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p className="sign-up-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
    );
};

export default SignUp;