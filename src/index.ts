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

import { addArticle } from "./DynamoDBHandler/dynamodb";
import { Reaction } from "@interfaces/Article";

const article = {
  id: 1,
  title: "Introduction to JavaScript",
  date: "2024-10-01",
  category: "Programming",
  summary: "A beginner's guide to JavaScript, covering the basics of the language, syntax, and common use cases.",
  description: "This article introduces JavaScript, one of the most widely used programming languages. It explains its history, basic syntax, and how to start using it for web development. It also touches on popular JavaScript libraries and frameworks.",
  dialogs: [
    {
      id: 1,
      speaker: "Alice",
      summary: "Alice introduces herself and starts talking about JavaScript.",
      response_to: [
        {
          dialog_id: 2,
          reaction: "AGREE" as Reaction
        }
      ]
    },
    {
      id: 2,
      speaker: "Bob",
      summary: "Bob agrees with Alice and adds some insights on the importance of JavaScript in modern web development.",
      response_to: []
    }
  ],
  participants: [
    {
      name: "Alice",
      summary: "A web developer with 5 years of experience in JavaScript and frontend frameworks."
    },
    {
      name: "Bob",
      summary: "A software engineer with expertise in both frontend and backend development."
    }
  ],
  keywords: ["JavaScript", "web development", "programming languages", "beginner guide"],
  terms: [
    {
      term: "JavaScript",
      definition: "A high-level, interpreted programming language primarily used for building interactive and dynamic websites."
    },
    {
      term: "Frontend",
      definition: "The part of a website or application that users interact with directly, typically involving HTML, CSS, and JavaScript."
    }
  ]
};

addArticle(article).then(() => {
  console.log("Article added");
}).catch((err) => {
  console.error(err);
});