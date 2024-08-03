// client/src/Search.js
import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, startAt, endAt, orderBy } from 'firebase/firestore';
import SearchResults from './SearchResults'; // Import the SearchResults component
import './Search.css'; // Import the CSS file for styling
import CommunityPage from './CommunityPage'; // Import the CommunityPage component

const Search = ({ currentUser, handleProfileClick, setMainContent, fetchTargetUser, refreshCommunities, setCurrentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('users');
  const searchContainerRef = useRef(null);
  const [results, setResults] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
  
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let results = [];
    if (searchType === 'users') {
      const usersRef = collection(db, 'users');
      const userQuery = query(
        usersRef,
        orderBy('displayNameLower'),
        where('displayNameLower', '>=', lowerCaseSearchTerm), 
        startAt(lowerCaseSearchTerm),
        endAt(lowerCaseSearchTerm + '\uf8ff')
      );
      const userQuerySnapshot = await getDocs(userQuery);
      results = userQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else if (searchType === 'communities') {
      const communitiesRef = collection(db, 'communities');
      const communityQuery = query(
        communitiesRef,
        orderBy('nameLower'),
        where('nameLower', '>=', lowerCaseSearchTerm), 
        startAt(lowerCaseSearchTerm),
        endAt(lowerCaseSearchTerm + '\uf8ff')
      );
      const communityQuerySnapshot = await getDocs(communityQuery);
      results = communityQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    setResults(results);
  };

  const handleClickOutside = (event) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
      setResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleResultClick = (id) => {
    if (searchType === 'users') {
      handleProfileClick(id);
    } else {
      setMainContent(<CommunityPage searchId={id} currentUser={currentUser} fetchTargetUser={fetchTargetUser} setCurrentUser={setCurrentUser} refreshCommunities={refreshCommunities}/>);
    }
  };
  return (
    <div className="search-container" ref={searchContainerRef}>
      <form onSubmit={handleSearch}>
        <select className="search-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="users">Users</option>
          <option value="communities">Communities</option>
        </select>
        <input
          className="search-input"
          type="text"
          placeholder={`Enter ${searchType === 'users' ? 'display name' : 'community name'}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" type="submit">Search</button>
      </form>
      {results.length > 0 && (
        <div>
          <SearchResults results={results} type={searchType} onClick={handleResultClick} />
        </div>
      )}
    </div>
  );
};

export default Search;