import express, { Request, Response } from 'express';
import cors from 'cors';
import { Article } from '@interfaces/Article'; // Assuming you have a types file for Article

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

const articles: Article[] = require('./samples');

app.get('/health', (req: Request, res: Response) => {
  res.send('Server is running and accessible');
});

app.get('/top-headlines', (req: Request, res: Response) => {
  const count = parseInt(req.query.count as string) || 5;
  const latestArticles = articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
  res.json({ articles: latestArticles });
});

app.get('/news', (req: Request, res: Response) => {
  const term = (req.query.term as string)?.toLowerCase() || '';
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(term) ||
    article.keywords.some(kw => kw.toLowerCase().includes(term))
  );
  res.json({ articles: filteredArticles });
});

app.get('/news/id/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const article = articles.find(article => article.id === id);
  if (article) {
    res.json({ article: article });
  } else {
    res.status(404).send('Article not found');
  }
});

app.get('/news/speaker/:speaker', (req: Request, res: Response) => {
  const speaker = req.params.speaker?.toLowerCase() || '';
  const filteredArticles = articles.filter(article =>
    article.participants.some(participant => participant.name.toLowerCase().includes(speaker))
  );
  res.json({ articles: filteredArticles });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});