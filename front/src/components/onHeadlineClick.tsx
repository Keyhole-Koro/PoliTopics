import React, { useState } from 'react';
import './TopHeadlines.css';

interface TopHeadlinesProps {
    headlines: { title: string; id: number; date: string; description: string; category: string }[];
    onHeadlineClick: (id: number) => void;
}

const TopHeadlines: React.FC<TopHeadlinesProps> = ({ headlines, onHeadlineClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredHeadlines = headlines
    .filter(headline =>
      headline.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (dateFilter === '' || headline.date === dateFilter) &&
      (categoryFilter === '' || headline.category === categoryFilter)
    )
    .sort((a, b) => sortOrder === 'asc' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime());

  const categories = Array.from(new Set(headlines.map(headline => headline.category)));

  return (
    <div className="top-headlines">
      <h2>Top Stories</h2>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search headlines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-filter"
        />
        <i className="fas fa-filter filter-icon"></i>
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sort-button">
          Sort by Date <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
        </button>
      </div>
      <div className="category-bar">
        <div className="category-bar-inner">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="headline-tiles">
        {filteredHeadlines.map((headline) => (
          <div key={headline.id} onClick={() => onHeadlineClick(headline.id)} className="headline-tile">
            <span className="headline-date">{headline.date}</span>
            <h3 className="headline-title">{headline.title}</h3>
            <p className="headline-description">{headline.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopHeadlines;