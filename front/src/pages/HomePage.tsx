import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopHeadlines from '../components/TopHeadlines';
import ArticleList from '../components/ArticleList';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const topHeadlines: { title: string; id: number; date: string; description: string; category: string }[] = [
    { title: 'Breaking: Market Hits All-Time High', id: 1, date: '2023-10-01', description: 'The stock market reached an all-time high today, driven by strong earnings reports and economic data.', category: 'Finance' },
    { title: 'Tech Innovation Conference Announced', id: 2, date: '2023-10-02', description: 'A major tech conference has been announced, promising to showcase the latest innovations in the industry.', category: 'Technology' },
    { title: 'Local Sports Team Wins Championship', id: 3, date: '2023-10-03', description: 'The local sports team clinched the championship title in a thrilling final match.', category: 'Sports' },
    { title: 'Government Proposes New Policy', id: 4, date: '2023-10-04', description: 'The government has proposed a new policy aimed at boosting economic growth and job creation.', category: 'Politics' },
    { title: '1', id: 5, date: '2023-10-05', description: 'Description for headline 1.', category: 'Miscellaneous' },
    { title: '2', id: 6, date: '2023-10-06', description: 'Description for headline 2.', category: 'Miscellaneous' },
    { title: '3', id: 7, date: '2023-10-07', description: 'Description for headline 3.', category: 'Miscellaneous' },
  ];

  const articles = [
    {
      id: 1,
      title: 'Market Hits All-Time High',
      summary: 'The stock market reached unprecedented levels today...',
      image: 'https://via.placeholder.com/600x400',
    },
    {
      id: 2,
      title: 'Tech Conference Announced',
      summary: 'A major tech conference is set for next month...',
      image: 'https://via.placeholder.com/600x400',
    },
    {
      id: 3,
      title: 'Local Team Wins Championship',
      summary: 'In a thrilling final match, the local team secured...',
      image: 'https://via.placeholder.com/600x400',
    },
  ];

  const handleHeadlineClick = (id: number) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Global News Hub</h1>
      </header>
      <TopHeadlines headlines={topHeadlines} onHeadlineClick={handleHeadlineClick} />
      <ArticleList articles={articles} />
    </div>
  );
};

export default HomePage;
