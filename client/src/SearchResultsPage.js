import React from 'react';
import SearchResults from './SearchResults'; 
import { useNavigate } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom'; 

const SearchResultsPage = () => {
    const location = useLocation();
  const navigate = useNavigate();
  const { results, type } = location.state || { results: [], type: 'users' };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCommunityClick = (communityId) => {
    navigate(`/communities/${communityId}`);
  };

  return (
    <div className="search-results-page">
      <h1>Search Results</h1>
      <SearchResults
        results={results}
        type={type}
        onClick={type === 'users' ? handleProfileClick : handleCommunityClick}
      />
    </div>
  );
};

export default SearchResultsPage;