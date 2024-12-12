import express, { Request, Response } from 'express';
import cors from 'cors';
import { DynamoDBHandler } from './DynamoDBHandler/dynamodb';
import { convertDynamoDBItemToArticle } from './interfaces/Article';
const app = express();
const PORT = 5000;

const ddbHandler = new DynamoDBHandler();

app.use(cors());

app.get('/health', (req: Request, res: Response) => {
  res.send('Server is running and accessible');
});

app.get('/top-headlines', async (req: Request, res: Response) => {
  const count = parseInt(req.query.count as string) || 5;
  const latestArticles = (await ddbHandler.getLatestArticles(count))
    .map(convertDynamoDBItemToArticle)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
  res.json({ articles: latestArticles });
});

app.get('/news', async (req: Request, res: Response) => {
  const keyword = (req.query.keyword as string)?.toLowerCase() || '';
  console.log(await ddbHandler.getArticlesByKeyword(keyword))
  const articles = await ddbHandler.getArticlesByKeyword(keyword);
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(keyword) ||
    article.keywords.some(kw => kw.toLowerCase().includes(keyword))
  );
  res.json({ articles: filteredArticles });
});

app.get('/news/id/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const article = await ddbHandler.getArticleById(id);
  if (article) {
    res.json({ article: article });
  } else {
    res.status(404).send('Article not found');
  }
});

app.get('/news/speaker/:speaker', async (req: Request, res: Response) => {
  const speaker = req.params.speaker?.toLowerCase() || '';
  const articles = (await ddbHandler.getArticlesByParticipant(speaker));
  res.json({ articles: articles });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
