import React from 'react';
import { Link } from 'react-router-dom';

const PSENavBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'models', label: 'Missions & Models' },
    { id: 'companies', label: 'Company Directory' },
    { id: 'sectors', label: 'Sector Explorer' },
    { id: 'news', label: 'News Feed' },
  ];

  const linkBase = 'font-medium text-sm border-b-2 transition-colors';
  const activeClass = `${linkBase} text-blue-600 border-blue-600`;
  const inactiveClass = `${linkBase} text-gray-600 hover:text-gray-800 border-transparent`;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/science-model-dashboard/pse" className="flex items-center gap-3">
          <img
            src="/science-model-dashboard/favicon-pse.svg"
            alt="PSE"
            className="h-10 w-10 rounded-md"
          />
          <div>
            <h1 className="text-lg font-semibold text-blue-900">PSE Dashboard</h1>
            <p className="text-sm text-gray-600">Private Sector Engagement</p>
          </div>
        </Link>

        <div className="flex gap-8 items-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? activeClass : inactiveClass}
            >
              {tab.label}
            </button>
          ))}

          <Link to="/science-model-dashboard" className={inactiveClass}>
            JEME
          </Link>
          <Link to="/science-model-dashboard/JEOE" className={inactiveClass}>
            JEOE
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PSENavBar;
