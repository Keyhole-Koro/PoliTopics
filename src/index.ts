/*
import generateSummery from "./gemini-handler/api";
import fetchKokkaiRecords from "./NationalDietAPI-handler/api";
import { instruction, output_format } from "./NationalDietAPI-handler/prompts";
import * as dotenv from 'dotenv';
dotenv.config();

const prompt = instruction + output_format;

fetchKokkaiRecords({
  endpoint: 'meeting',
  query: {
    startRecord: 1,
    maximumRecords: 1,
    from: '2024-10-01',
    until: '2024-10-01',
    recordPacking: 'json'
  }
}).then((res) => {
  console.log(res);
});

//const gemini_api_key = process.env.GEMINI_API_KEY || "";
//console.log(gemini_api_key);
/*
generateSummery(gemini_api_key, conv).then((res) => {
  console.log(res);
});
*/

import { DynamoDBHandler } from "./DynamoDBHandler/dynamodb";
import { Article, Reaction } from "@interfaces/Article";
import { articles } from "./samples/samples";

const ddbHandler = new DynamoDBHandler();
/*
articles.forEach(async (article: Article) => {
  try {
    await ddbHandler.addNews(article);
    console.log("Article added");
  } catch (err) {
    console.error(err);
  }
});
*/

/*
ddbHandler.getArticleById("3").then((res: any) => {
  console.log("getArticleById", res);
}).catch((err: any) => {
  console.error("getArticleById", err);
});
*/

ddbHandler.getArticleByKeyword("finance").then((res: any) => {
  console.log("getArticlesByKeyword", res);
}).catch((err: any) => {
  console.error("getArticlesByKeyword" ,err);
});

/*
ddbHandler.getArticleByDate("2024-10-06").then((res: any) => {
  console.log("getArticleByDate", res);
}).catch((err: any) => {
  console.error("getArticleByDate", err);
});
*/