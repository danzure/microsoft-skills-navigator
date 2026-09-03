import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMap as Icons } from '../common/IconMap';
const { Menu } = Icons;
import SearchBar from '../common/SearchBar';
import DataModal from '../common/DataModal';
import ThemeToggle from './ThemeToggle';
import './Header.css';

/**
 * Header Component
 * 
 * Displays the top navigation bar containing the sidebar toggle,
 * application brand, theme toggle flyout, and search bar.
 * 
 * @param {Object} props
 * @param {Function} props.onToggleSidebar - Callback to toggle the sidebar's open/close state
 */
const Header = ({ onToggleSidebar }) => {
  const [dataModalOpen, setDataModalOpen] = useState(false);

  return (
    <header className="header" id="app-header">
      <div className="header__left">
        <button
          className="header__menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          id="toggle-sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="header__brand" id="brand-link">
          <a href="https://atozazure.com" className="header__brand-prefix">atozazure</a>
          <span className="header__brand-divider">|</span>
          <Link to="/" className="header__brand-title">Certification Tracker</Link>
        </div>
      </div>

      <div className="header__center">
        <SearchBar />
      </div>

      <div className="header__right">
        <button
          className="header__data-btn"
          onClick={() => setDataModalOpen(true)}
          aria-label="Data & preferences"
          title="Data backup, restore & settings"
        >
          <Icons.DatabaseIcon size={16} className="header__data-btn-icon" />
          <span className="header__data-btn-label">Data</span>
        </button>
        <ThemeToggle />
      </div>

      <DataModal isOpen={dataModalOpen} onClose={() => setDataModalOpen(false)} />
    </header>
  );
};

export default Header;
