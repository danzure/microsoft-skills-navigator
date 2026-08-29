import { IconMap } from './IconMap';
const { Search, X } = IconMap;
import { useState, useRef, useEffect } from 'react';
import { getAllCertifications } from '../../data/certificationPaths';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

/**
 * A search component with autocomplete dropdown that searches across all available certifications.
 * Displays results that match the query in name, code, path name, or description.
 * 
 * @param {Object} props
 * @param {Function} [props.onClose] - Optional callback triggered when a search result is selected
 */
const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const hasText = val.trim().length > 0;
    setIsOpen(hasText);
    if (hasText) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setDebouncedQuery('');
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const allCerts = getAllCertifications();

  const q = debouncedQuery.toLowerCase().trim();
  const results = q.length > 0 
    ? allCerts.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.examCode.toLowerCase().includes(q) ||
          c.pathName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      ).slice(0, 8)
    : [];

  const handleSelect = (cert) => {
    navigate(`/path/${cert.pathId}?cert=${cert.id}`);
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrapper">
        <Search size={16} className="search-bar__icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          placeholder="Search certifications..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setIsOpen(true)}
          id="search-certifications"
        />
        {!query && (
          <span className="search-bar__shortcut">Ctrl K</span>
        )}
        {query && isSearching && (
          <IconMap.RefreshCw size={14} className="search-bar__spinner" />
        )}
        {query && !isSearching && (
          <button className="search-bar__clear" onClick={() => { setQuery(''); setDebouncedQuery(''); setIsOpen(false); }}>
            <X size={14} />
          </button>
        )}
      </div>
      {isOpen && results.length > 0 && (
        <div className="search-bar__dropdown">
          {results.map((cert) => (
            <button
              key={`${cert.pathId}-${cert.id}`}
              className="search-bar__result"
              onClick={() => handleSelect(cert)}
            >
              <span className="search-bar__result-dot" style={{ background: cert.pathColor }} />
              <div className="search-bar__result-info">
                <span className="search-bar__result-name">{cert.name}</span>
                <span className="search-bar__result-code">{cert.examCode}</span>
              </div>
              <span className="search-bar__result-path">{cert.pathName}</span>
            </button>
          ))}
        </div>
      )}
      {isOpen && query && results.length === 0 && (
        <div className="search-bar__dropdown">
          <div className="search-bar__empty">No certifications found</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
