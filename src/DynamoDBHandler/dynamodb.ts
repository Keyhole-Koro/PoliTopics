import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  ScanCommand,
  DescribeTableCommand,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { Article } from "@interfaces/Article";

// Configuration for AWS DynamoDB
const REGION = "us-east-1"; // Replace with your AWS region
const ACCESS_KEY_ID = "local"; // Replace with your AWS Access Key ID
const SECRET_ACCESS_KEY = "local"; // Replace with your AWS Secret Access Key

// DynamoDB Client Configuration
export const client = new DynamoDBClient({
  region: REGION,
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Articles";

// テーブルが存在しない場合は作成
const createTableIfNotExist = async () => {
  try {
    // テーブルが存在するか確認
    const describeCommand = new DescribeTableCommand({
      TableName: TABLE_NAME,
    });
    await client.send(describeCommand);
    console.log(`Table ${TABLE_NAME} already exists.`);
  } catch (error) {
    // テーブルが存在しない場合は作成
    if ((error as { name: string }).name === "ResourceNotFoundException") {
      console.log(`Table ${TABLE_NAME} not found. Creating table...`);

      const createCommand = new CreateTableCommand({
        TableName: TABLE_NAME,
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "N" },
          { AttributeName: "date", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "id", KeyType: "HASH" }, // 主キー
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
        GlobalSecondaryIndexes: [

          {
            IndexName: "DateIndex", // GSI2
            KeySchema: [
              { AttributeName: "date", KeyType: "HASH" }, // GSIのHASHキー
            ],
            Projection: { ProjectionType: "ALL" },
            ProvisionedThroughput: {
              ReadCapacityUnits: 3,
              WriteCapacityUnits: 3,
            },
          },
          
        ],
      });

      await client.send(createCommand);
      console.log(`Table ${TABLE_NAME} created successfully.`);
    } else {
      // 他のエラー
      console.error("Error describing table:", error);
    }
  }
};

// Article idをキーにしてArticleを取得
export const getArticleById = async (id: number): Promise<Article | null> => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });
  const response = await ddbDocClient.send(command);
  return response.Item as Article | null;
};

// Speaker名で該当Articleを取得
export const getArticlesBySpeaker = async (
  speakerName: string
): Promise<Article[]> => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "ParticipantsIndex", // GSI1
    KeyConditionExpression: "participants.name = :speakerName",
    ExpressionAttributeValues: {
      ":speakerName": { S: speakerName },
    },
  });
  const response = await ddbDocClient.send(command);
  return response.Items as unknown as Article[];
};

// 最新のArticleを30個取得
export const getLatestArticles = async (): Promise<Article[]> => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    Limit: 30,
  });
  const response = await ddbDocClient.send(command);
  return response.Items as unknown as Article[];
};

// 日付別にArticleを取得
export const getArticlesByDate = async (date: string): Promise<Article[]> => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "DateIndex", // GSI2
    KeyConditionExpression: "date = :date",
    ExpressionAttributeValues: {
      ":date": { S: date },
    },
  });
  const response = await ddbDocClient.send(command);
  return response.Items as unknown as Article[];
};

// キーワードでArticleを取得
export const getArticlesByKeyword = async (
  keyword: string
): Promise<Article[]> => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "KeywordsIndex", // GSI3
    KeyConditionExpression: "keywords = :keyword",
    ExpressionAttributeValues: {
      ":keyword": { S: keyword },
    },
  });
  const response = await ddbDocClient.send(command);
  return response.Items as unknown as Article[];
};

// サンプル：Articleの追加
export const addArticle = async (article: Article): Promise<void> => {
  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      id: { N: article.id.toString() },
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
    await ddbDocClient.send(command);
    console.log("Article added successfully.");
  } catch (error) {
    console.error("Error adding article:", error);
  }
};

console.log("DynamoDB client initialized");