import { Handler } from 'aws-lambda';
import { DynamoDBHandler } from '@DynamoDBHandler/dynamodb';
import SpeechFormatter, { ProcessResult } from '@services/recordFormatter';
import fetchRecords from '@NationalDietAPIHandler/api';

const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "local";
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "local";
const DDB_ENDPOINT = process.env.AWS_DYNAMODB_ENDPOINT || "http://localhost:8000";

const DIET_API_ENDPOINT = process.env.DIET_API_ENDPOINT || "https://kokkai.ndl.go.jp/api/speech";

interface DateRange {
    from: string;
    until: string;
}

function getDateRange(): DateRange {
    const now = new Date();
    
    const until = now.toISOString().split('T')[0]; // Current date in YYYY-MM-DD
    
    const from = now.toISOString().split('T')[0];

    return { from, until };
}

export const handler: Handler = async (event) => {
    const ddbHandler = new DynamoDBHandler(DDB_ENDPOINT, ACCESS_KEY_ID, SECRET_ACCESS_KEY);
    
    const formatter = new SpeechFormatter();

    try {
        // Get date range from event or use default (1 month)
        const { from, until } = getDateRange();

        const records = await fetchRecords(
            DIET_API_ENDPOINT,
            {
            from,
            until,
            ...event?.additionalParams // Allow other params to be passed through event
        });

        const processedIssues: ProcessResult = formatter.processData(records);



        // Scraper specific logic
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
