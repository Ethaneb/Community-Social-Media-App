import React from 'react';
import PropTypes from 'prop-types';
import './SearchResults.css';

const SearchResults = ({ results, type, onClick }) => {
    return (
        <div className="results-container">
            {results.length > 0 ? (
                results.map(result => (
                    <div key={result.id} onClick={() => onClick(result.id)} className="result-item">
                        {type === 'users' && result.profilePictureUrl && (
                            <img src={result.profilePictureUrl} alt={result.displayName} className="profile-picture-small" />
                        )}
                        {type === 'users' ? result.displayName : result.name}
                    </div>
                ))
            ) : (
                <p>No {type} found</p>
            )}
        </div>
    );
};

SearchResults.propTypes = {
    results: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default SearchResults;