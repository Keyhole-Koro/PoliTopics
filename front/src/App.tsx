import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArticleDetail from './pages/ArticleDetails';
import { Article } from '@interfaces/Article';

const App: React.FC = () => {

  const articles: Article[] = [
    { title: 'Breaking: Market Hits All-Time High', id: 1, date: '2023-10-01', description: 'The stock market reached an all-time high today, driven by strong earnings reports and economic data.', category: 'Finance' },
    { title: 'Tech Innovation Conference Announced', id: 2, date: '2023-10-02', description: 'A major tech conference has been announced, promising to showcase the latest innovations in the industry.', category: 'Technology' },
    { title: 'Local Sports Team Wins Championship', id: 3, date: '2023-10-03', description: 'The local sports team clinched the championship title in a thrilling final match.', category: 'Sports' },
    { title: 'Government Proposes New Policy', id: 4, date: '2023-10-04', description: 'The government has proposed a new policy aimed at boosting economic growth and job creation.', category: 'Politics' },
    { title: 'Finance Headline 1', id: 5, date: '2023-10-05', description: 'Description for headline 1.', category: 'Finance' },
    { title: 'Miscellaneous Headline 2', id: 6, date: '2023-10-06', description: 'Description for headline 2.', category: 'Miscellaneous' },
    { title: 'Miscellaneous Headline 3', id: 7, date: '2023-10-07', description: 'Description for headline 3.', category: 'Miscellaneous' },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage articles={articles} />} />
        <Route path="/article/:id" element={<ArticleDetail articles={articles} />} />
      </Routes>
    </Router>
  );
};

export default App;