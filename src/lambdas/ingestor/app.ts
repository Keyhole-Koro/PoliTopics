import { Handler } from 'aws-lambda';
import { DynamoDBHandler } from '@DynamoDBHandler/dynamodb';
import SpeechFormatter, { ProcessResult } from '@services/recordFormatter';
import fetchRecords from '@NationalDietAPIHandler/NationalDietAPI';
import { ProcessedIssue } from '@interfaces/Speech';
import geminiAPI from '@GeminiHandler/gemini';
import { compose_prompt } from '@GeminiHandler/prompts';

const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "local";
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "local";
const DDB_ENDPOINT = process.env.AWS_DYNAMODB_ENDPOINT || "http://localhost:8000";

const DIET_API_ENDPOINT = process.env.DIET_API_ENDPOINT || "https://kokkai.ndl.go.jp/api/speech";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

interface DateRange {
    from: string;
    until: string;
}

const dateRange = (from_: Date, until_: Date): DateRange => {
    
    const from = from_.toISOString().split('T')[0];

    const until = until_.toISOString().split('T')[0]; // Current date in YYYY-MM-DD    

    return { from, until };
}

export const handler: Handler = async (event) => {
    const ddbHandler = new DynamoDBHandler(DDB_ENDPOINT, ACCESS_KEY_ID, SECRET_ACCESS_KEY);
    
    const formatter = new SpeechFormatter();

    try {
        // Get date range from event or use default (1 month)
        const now = new Date();
        const { from, until } = dateRange(now, now);

        const records = await fetchRecords(
            DIET_API_ENDPOINT,
            {
            from,
            until,
            ...event?.additionalParams // Allow other params to be passed through event
        });

        const processedIssues: ProcessResult = formatter.processData(records);

        if (Array.isArray(processedIssues.data)) {
            processedIssues.data.forEach((issue: ProcessedIssue) => {
                const result = geminiAPI(GEMINI_API_KEY, compose_prompt(issue.toString()))
            });
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Scraping completed' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to scrape',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};
