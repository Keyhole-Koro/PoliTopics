import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ArticleList.css';

interface Article {
  id: number;
  title: string;
  summary: string;
  image: string;
}

interface ArticleListProps {
  articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="article-list">
      {articles.map((article) => (
        <div className="article-card" key={article.id} onClick={() => handleClick(article.id)}>
          <img src={article.image} alt={article.title} />
          <div className="article-content">
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
