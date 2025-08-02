import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <div className="dropdown">
      <button 
        className="btn btn-outline-light dropdown-toggle" 
        type="button" 
        id="languageDropdown" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
        style={{ 
          fontSize: '0.9rem', 
          padding: '6px 12px',
          borderColor: '#B7E4C7',
          color: '#B7E4C7'
        }}
      >
        <i className="fas fa-globe me-1"></i>
        {language === 'en' ? 'EN' : 'বাং'}
      </button>
      <ul className="dropdown-menu" aria-labelledby="languageDropdown">
        <li>
          <button 
            className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
            style={{ cursor: 'pointer' }}
          >
            <span className="me-2">🇺🇸</span>
            {t('english')}
            {language === 'en' && <i className="fas fa-check ms-2 text-success"></i>}
          </button>
        </li>
        <li>
          <button 
            className={`dropdown-item ${language === 'bn' ? 'active' : ''}`}
            onClick={() => changeLanguage('bn')}
            style={{ cursor: 'pointer' }}
          >
            <span className="me-2">🇧🇩</span>
            {t('bangla')}
            {language === 'bn' && <i className="fas fa-check ms-2 text-success"></i>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher; 