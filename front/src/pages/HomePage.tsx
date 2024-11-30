import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopHeadlines from '../components/TopHeadlines';
import { Article } from '@interfaces/Article';

interface HomePageProps {
  articles: Article[];
}

const HomePage: React.FC<HomePageProps> = ({ articles }) => {
  const navigate = useNavigate();

  const handleHeadlineClick = (id: number) => {
    navigate(`/article/${id}`);
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-container">
          <h1 className="app-title">PoliTopics</h1>
        </div>
      </header>
      <div>
          <TopHeadlines headlines={articles} onHeadlineClick={handleHeadlineClick} />
      </div>
    </div>
  );
};

export default HomePage;