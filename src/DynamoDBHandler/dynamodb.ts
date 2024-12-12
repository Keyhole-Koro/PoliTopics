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
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { Article } from "@interfaces/Article";

export class DynamoDBHandler {

  private readonly client: DynamoDBClient;
  private readonly ddbDocClient: DynamoDBDocumentClient;
  private readonly ARTICLE_TABLE_NAME: string;
  private readonly KEYWORD_TABLE_NAME: string;
  private readonly PARTICIPANT_TABLE_NAME: string;
  private readonly REGION: string;
  private readonly ACCESS_KEY_ID: string;
  private readonly SECRET_ACCESS_KEY: string;
  private readonly DateIndex: string;

  constructor() {
    this.ARTICLE_TABLE_NAME = "Articles";
    this.KEYWORD_TABLE_NAME = "KeywordArticleIds";
    this.PARTICIPANT_TABLE_NAME = "ParticipantArticleIds";
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
      await this.addKeyword(keyword, news.id.toString());
    }
    console.log("Keywords added successfully.");
    // Add participants to the database
    for (const participant of news.participants) {
      await this.addParticipant(participant.name, news.id.toString());
    }
    console.log("Participants added successfully.");
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

  async addKeyword(keyword: string, articleId: string): Promise<void> {
    const params = {
      TableName: this.KEYWORD_TABLE_NAME,
      Item: {
        keyword: { S: keyword },
        dataId: { S: articleId },
      },
    };
  
    try {
      await this.ddbDocClient.send(new PutItemCommand(params));
      console.log(`Successfully added keyword: ${keyword}, dataId: ${articleId}`);
    } catch (error) {
      console.error("Error adding keyword index:", error);
    }
  };

  async addParticipant(participant: string, articleId: string): Promise<void> {
    const params = {
      TableName: this.PARTICIPANT_TABLE_NAME,
      Item: {
        participant: { S: participant },
        dataId: { S: articleId },
      },
    };
  
    try {
      await this.ddbDocClient.send(new PutItemCommand(params));
      console.log(`Successfully added participant: ${participant}, dataId: ${articleId}`);
    } catch (error) {
      console.error("Error adding participant index:", error);
    }
  };

  async getArticleIdsByKeyword(keyword: string): Promise<string[]> {
    const command = new QueryCommand({
      TableName: this.PARTICIPANT_TABLE_NAME,
      KeyConditionExpression: "#k = :keywordValue",
      ExpressionAttributeNames: {
        "#k": "keyword",
      },
      ExpressionAttributeValues: {
        ":keywordValue": { S: keyword },
      },
    });
  
    try {
      const result = await this.ddbDocClient.send(command);
      return (result.Items || []).map(item => item.dataId.S!);
    } catch (error) {
      console.error("Error retrieving data IDs:", error);
      return [];
    }
  }

  async getArticleIdsByParticipant(participant: string): Promise<string[]> {
    const command = new QueryCommand({
      TableName: this.PARTICIPANT_TABLE_NAME,
      KeyConditionExpression: "#p = :participantValue",
      ExpressionAttributeNames: {
        "#p": "participant",
      },
      ExpressionAttributeValues: {
        ":participantValue": { S: participant },
      },
    });
  
    try {
      const result = await this.ddbDocClient.send(command);
      return (result.Items || []).map(item => item.dataId.S!);
    } catch (error) {
      console.error("Error retrieving data IDs:", error);
      return [];
    }
  }

  async getArticlesByKeyword(keyword: string): Promise<Article[]> {
    const articleIds = await this.getArticleIdsByKeyword(keyword);
    if (!articleIds.length) {
      return [];
    }
  
    const articles: (Article | null)[] = await Promise.all(
      articleIds.map(async (id) => {
        const fetchedArticle = await this.getArticleById(id);
        return fetchedArticle;
      })
    );
    // Filter out any null values
    return articles.filter(article => article !== null) as Article[];
  }

  async getArticlesByParticipant(id: string): Promise<Article[]> {
    const articleIds = await this.getArticleIdsByParticipant(id);
    if (!articleIds.length) {
      return [];
    }

    const articles: (Article | null)[] = await Promise.all(
      articleIds.map(async (id) => {
        const fetchedArticle = await this.getArticleById(id);
        return fetchedArticle;
      })
    );
    // Filter out any null values
    return articles.filter(article => article !== null) as Article[];
}

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

  async getLatestArticles(limit: number): Promise<Article[]> {
    const command = new ScanCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      Limit: limit | 5,
    });
    const response = await this.ddbDocClient.send(command);
    return response.Items as unknown as Article[];
  }

  async getArticleByDate(date: string): Promise<Article[]> {
    const command = new QueryCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      IndexName: this.DateIndex, // GSI2
      KeyConditionExpression: "#date = :dateValue",
      ExpressionAttributeNames: {
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":dateValue": { S: date },
      },
    });
    const response = await this.ddbDocClient.send(command);
    return response.Items as unknown as Article[];
  }
};
