import React from 'react';
import { useParams } from 'react-router-dom';
import './ArticleDetails.css';

const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();

  // Placeholder for fetching detailed content based on ID
  const articleData = {
    1: { title: 'Market Hits All-Time High', content: 'Detailed information about the market...' },
    2: { title: 'Tech Conference Announced', content: 'Details about the upcoming tech conference...' },
    3: { title: 'Local Team Wins Championship', content: 'In-depth coverage of the championship...' },
  };

  const article = articleData[parseInt(id!, 10) as keyof typeof articleData];

  if (!article) {
    return <div className="article-details">Article not found.</div>;
  }

  return (
    <div className="article-details">
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
};

export default ArticleDetails;
