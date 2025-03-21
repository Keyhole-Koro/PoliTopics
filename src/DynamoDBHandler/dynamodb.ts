import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Article } from "@interfaces/Article";

export class DynamoDBHandler {
  private readonly client: DynamoDBClient;
  private readonly ddbDocClient: DynamoDBDocumentClient;
  private readonly ARTICLE_TABLE_NAME = "Articles";
  private readonly KEYWORD_TABLE_NAME = "KeywordArticleIds";
  private readonly PARTICIPANT_TABLE_NAME = "ParticipantArticleIds";
  private readonly REGION = "us-east-1";
  private readonly DateIndex = "DateIndex";

  constructor(endpoint: string, access_key_id: string, secret_access_key: string) {
    this.client = new DynamoDBClient({
      region: this.REGION,
      endpoint: endpoint,
      credentials: {
        accessKeyId: access_key_id,
        secretAccessKey: secret_access_key,
      },
    });
    this.ddbDocClient = DynamoDBDocumentClient.from(this.client);
  }

  private async putItem(params: PutItemCommand): Promise<void> {
    try {
      await this.ddbDocClient.send(params);
      console.log(`Successfully added item to ${params.input.TableName}`);
    } catch (error) {
      console.error(`Error adding item to ${params.input.TableName}:`, error);
    }
  }

  private async queryItems(command: QueryCommand): Promise<string[]> {
    try {
      const result = await this.ddbDocClient.send(command);
      return (result.Items || []).map((item) => item.dataId.S!);
    } catch (error) {
      console.error("Error retrieving data IDs:", error);
      return [];
    }
  }

  async addNews(news: Article): Promise<void> {
    await this.addArticle(news);
    console.log("Article added successfully.");

    for (const keyword of news.keywords) {
      await this.addKeyword(keyword, news.id.toString());
    }
    console.log("Keywords added successfully.");

    for (const participant of news.participants) {
      await this.addParticipant(participant.name, news.id.toString());
    }
    console.log("Participants added successfully.");
  }

  async addArticle(article: Article): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      Item: {
        id: { S: article.id },
        title: { S: article.title },
        date: { S: article.date },
        category: { S: article.category },
        summary: { S: article.summary },
        description: { S: article.description },
        dialogs: {
          L: article.dialogs.map((dialog) => ({
            M: {
              order: { N: dialog.order.toString() },
              speaker: { S: dialog.speaker },
              summary: { S: dialog.summary },
              response_to: {
                L: dialog.response_to.map((response) => ({
                  M: {
                    dialog_id: { N: response.dialog_id.toString() },
                    reaction: { S: response.reaction },
                  },
                })),
              },
            },
          })),
        },
        participants: {
          L: article.participants.map((participant) => ({
            M: {
              name: { S: participant.name },
              summary: { S: participant.summary },
            },
          })),
        },
        keywords: { SS: article.keywords },
        terms: {
          L: article.terms.map((term) => ({
            M: {
              term: { S: term.term },
              definition: { S: term.definition },
            },
          })),
        },
      },
    });

    await this.putItem(command);
  }

  async addKeyword(keyword: string, articleId: string): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.KEYWORD_TABLE_NAME,
      Item: {
        keyword: { S: keyword },
        dataId: { S: articleId },
      },
    });

    await this.putItem(command);
  }

  async addParticipant(participant: string, articleId: string): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.PARTICIPANT_TABLE_NAME,
      Item: {
        participant: { S: participant },
        dataId: { S: articleId },
      },
    });

    await this.putItem(command);
  }

  async getArticleIdsByKeyword(keyword: string): Promise<string[]> {
    const command = new QueryCommand({
      TableName: this.KEYWORD_TABLE_NAME,
      KeyConditionExpression: "#k = :keywordValue",
      ExpressionAttributeNames: { "#k": "keyword" },
      ExpressionAttributeValues: { ":keywordValue": { S: keyword } },
    });

    return this.queryItems(command);
  }

  async getArticleIdsByParticipant(participant: string): Promise<string[]> {
    const command = new QueryCommand({
      TableName: this.PARTICIPANT_TABLE_NAME,
      KeyConditionExpression: "#p = :participantValue",
      ExpressionAttributeNames: { "#p": "participant" },
      ExpressionAttributeValues: { ":participantValue": { S: participant } },
    });

    return this.queryItems(command);
  }

  async getArticlesByKeyword(keyword: string): Promise<Article[]> {
    const articleIds = await this.getArticleIdsByKeyword(keyword);
    if (!articleIds.length) return [];

    const articles = await Promise.all(
      articleIds.map((id) => this.getArticleById(id))
    );
    return articles.filter((article): article is Article => article !== null);
  }

  async getArticlesByParticipant(participant: string): Promise<Article[]> {
    const articleIds = await this.getArticleIdsByParticipant(participant);
    if (!articleIds.length) return [];

    const articles = await Promise.all(
      articleIds.map((id) => this.getArticleById(id))
    );
    return articles.filter((article): article is Article => article !== null);
  }

  async getArticleById(id: string): Promise<Article | null> {
    const command = new GetCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      Key: { id: id },
    });

    try {
      const response = await this.ddbDocClient.send(command);
      return response.Item as Article | null;
    } catch (error) {
      console.error("Error retrieving article:", error);
      return null;
    }
  }

  async getLatestArticles(limit: number): Promise<Article[]> {
    const command = new ScanCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      Limit: limit,
    });

    try {
      const response = await this.ddbDocClient.send(command);
      return response.Items as unknown as Article[];
    } catch (error) {
      console.error("Error retrieving latest articles:", error);
      return [];
    }
  }

  async getArticleByDate(date: string): Promise<Article[]> {
    const command = new QueryCommand({
      TableName: this.ARTICLE_TABLE_NAME,
      IndexName: this.DateIndex,
      KeyConditionExpression: "#date = :dateValue",
      ExpressionAttributeNames: { "#date": "date" },
      ExpressionAttributeValues: { ":dateValue": { S: date } },
    });

    try {
      const response = await this.ddbDocClient.send(command);
      return response.Items as unknown as Article[];
    } catch (error) {
      console.error("Error retrieving articles by date:", error);
      return [];
    }
  }
}