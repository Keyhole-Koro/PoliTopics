import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  ScanCommand,
  DescribeTableCommand,
  CreateTableCommand,
  UpdateTableCommand,
  AttributeDefinition,
  ScalarAttributeType,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { Article } from "@interfaces/Article";

export class DynamoDBHandler {

  private readonly client: DynamoDBClient;
  private readonly ddbDocClient: DynamoDBDocumentClient;
  private readonly ARTICLE_TABLE_NAME: string;
  private readonly KEYWORD_TABLE_NAME: string;
  private readonly REGION: string;
  private readonly ACCESS_KEY_ID: string;
  private readonly SECRET_ACCESS_KEY: string;
  private readonly DateIndex: string;

  constructor() {
    this.ARTICLE_TABLE_NAME = "NextArticles";
    this.KEYWORD_TABLE_NAME = "Keywords";
    this.REGION = "us-east-1";
    this.ACCESS_KEY_ID = "local";
    this.SECRET_ACCESS_KEY = "local";
    this.DateIndex = "DateIndex";
    this.client = new DynamoDBClient({
      region: this.REGION,
      endpoint: "http://localhost:8000",
      credentials: {
        accessKeyId: this.ACCESS_KEY_ID,
        secretAccessKey: this.SECRET_ACCESS_KEY,
      },
    });
    this.ddbDocClient = DynamoDBDocumentClient.from(this.client);
  }
  
  async addNews(news: Article): Promise<void> {
    // Add article to the database
    await this.addArticle(news);
    console.log("Article added successfully.");
    // Add keywords to the database
    for (const keyword of news.keywords) {
      await this.addKeyword(keyword, news.id);
    }
    console.log("Keywords added successfully.");
  }

  async addArticle(article: Article): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      Item: {
        id: { S: article.id.toString() },
        title: { S: article.title },
        date: { S: article.date },
        category: { S: article.category },
        summary: { S: article.summary },
        description: { S: article.description },
        dialogs: { L: article.dialogs.map(dialog => ({
          M: {
            id: { N: dialog.id.toString() },
            speaker: { S: dialog.speaker },
            summary: { S: dialog.summary },
            response_to: { L: dialog.response_to.map(response => ({
              M: {
                dialog_id: { N: response.dialog_id.toString() },
                reaction: { S: response.reaction }
              }
            })) }
          }
        })) },
        participants: { L: article.participants.map(participant => ({
          M: {
            name: { S: participant.name },
            summary: { S: participant.summary }
          }
        })) },
        keywords: { SS: article.keywords }, // Ensure this is an array of strings
        terms: { L: article.terms.map(term => ({
          M: {
            term: { S: term.term },
            definition: { S: term.definition }
          }
        })) }
      }
    });
    
    try {
      await this.ddbDocClient.send(command);
      console.log("Article added successfully.");
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  async addKeyword(keyword: string, articleId: number): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.KEYWORD_TABLE_NAME,
      Item: {
        keyword: { S: keyword },
        articleId: { N: articleId.toString() }
      }
    });
    
    try {
      await this.ddbDocClient.send(command);
      console.log("Keyword added successfully.");
    } catch (error) {
      console.error("Error adding keyword:", error);
    }
  }
    /*

  async getArticlesByKeyword(keyword: string): Promise<Article[]> {
    // DynamoDB クエリ
    const command = new QueryCommand({
      TableName: this.KEYWORD_TABLE_NAME,
      IndexName: "KeywordIndex", // GSI1
      KeyConditionExpression: "#keywords = :keywordsValue",
      ExpressionAttributeNames: {
        "#keywords": "keywords",
      },
      ExpressionAttributeValues: {
        ":keywordsValue": { S: keyword },
      },
    });
  
    const response = await this.ddbDocClient.send(command);

    console.log(response);
  
    // articleId を収集
    const articleIds = response.Items?.map(item => {
      // item.articleId が適切な型かどうか確認
      if (item.articleId?.S) {
        return item.articleId.S; // 文字列型
      }
      return null;
    }).filter((id): id is string => id !== null); // null を除外

    if (!articleIds) {
      return [];
    }
  
    // 並列に記事を取得
    const articles = await Promise.all(
      articleIds.map(async articleId => {
        try {
          return await this.getArticleById(articleId);
        } catch (err) {
          console.error(`Failed to fetch article with ID: ${articleId}`, err);
          return null; // エラー時は null を返す
        }
      })
    );
  
    // null を除外して返却
    return articles.filter((article): article is Article => article !== null);
  }
  
    */

  async getArticleById(id: string): Promise<Article | null> {
    const command = new GetCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      Key: { 
        id: id
      }
    });
    const response = await this.ddbDocClient.send(command);
    return response.Item as Article | null;
  };

  async getLatestArticles(): Promise<Article[]> {
    const command = new ScanCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      Limit: 30,
    });
    const response = await this.ddbDocClient.send(command);
    return response.Items as unknown as Article[];
  }

  async getArticleByDate(date: string): Promise<Article[]> {
    const command = new QueryCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      IndexName: this.DateIndex, // GSI2
      KeyConditionExpression: "#date = :dateValue", // クエリ条件
      ExpressionAttributeNames: {
        "#date": "date", // date 属性名
      },
      ExpressionAttributeValues: {
        ":dateValue": { S: date }, // 検索値を AttributeValue 型で指定
      },
    });
    const response = await this.ddbDocClient.send(command);
    return response.Items as unknown as Article[];
  }
};
