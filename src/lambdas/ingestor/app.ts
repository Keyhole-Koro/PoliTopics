import { Handler } from 'aws-lambda';
import { DynamoDBHandler } from '@DynamoDBHandler/dynamodb';
import SpeechFormatter from '@services/recordFormatter';
import fetchRecords from '@NationalDietAPIHandler/NationalDietAPI';
import { MapIssue } from '@interfaces/Speech';
import geminiAPI from '@GeminiHandler/gemini';
import { compose_prompt } from '@GeminiHandler/prompts';
import { parseArticleOutput } from '@GeminiHandler/parseOutput';

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
        const { from, until } = dateRange(new Date(), new Date());
        
        const records = await fetchRecords(DIET_API_ENDPOINT, {
            from, until,
            ...event?.additionalParams
        });

        const mappedIssues = formatter.mapRecords(records);
        const stats = formatter.getStats(mappedIssues);

        for (const [issueId, issue] of Object.entries(mappedIssues)) {
            const result = await geminiAPI(GEMINI_API_KEY, compose_prompt(issue.toString()));
            const parsedResult = parseArticleOutput(JSON.stringify(result));
            await ddbHandler.addArticle(parsedResult);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Processing completed',
                stats
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Processing failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};
