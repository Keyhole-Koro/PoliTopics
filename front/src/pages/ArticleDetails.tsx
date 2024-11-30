import React from 'react';
import './ArticleDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Article } from '@interfaces/Article';

const ArticleDetail: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = articles.find(article => article.id === parseInt(id || '', 10));

  if (!article) {
    return <div>Article not found</div>;
  }

  const relatedHeadlines = articles.filter(
    headline => headline.category === article.category && headline.id !== article.id
  );

  return (
    <div className="article-details">
      <button onClick={() => navigate(-1)} className="back-button">Back to Headlines</button>
      <h3>{article.title}</h3>
      <span className="headline-date">{article.date}</span>
      <p>{article.description}</p>
      <h4>Related Articles</h4>
      <div className="headline-tiles">
        {relatedHeadlines.map((headline) => (
          <div key={headline.id} onClick={() => navigate(`/article/${headline.id}`)} className="headline-tile">
            <span className="headline-date">{headline.date}</span>
            <h3 className="headline-title">{headline.title}</h3>
            <p className="headline-description">{headline.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleDetail;