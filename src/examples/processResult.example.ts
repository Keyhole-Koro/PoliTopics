import { ProcessResult } from '../services/recordFormatter';

// Successful processing example
export const successfulProcessResult: ProcessResult = {
    success: true,
    data: {
        "121305254X00420240201": {
            imageKind: "会議録",
            session: 213,
            nameOfHouse: "衆議院",
            nameOfMeeting: "本会議",
            date: "2024-02-01",
            speeches: [
                {
                    speechOrder: 0,
                    speaker: "会議録情報",
                    speakerYomi: "None",
                    speakerGroup: "None",
                    speakerPosition: "None",
                    speakerRole: "None",
                    speech: "令和六年二月一日（木曜日） ..."
                },
                {
                    speechOrder: 1,
                    speaker: "額賀福志郎",
                    speakerYomi: "ぬかがふくしろう",
                    speakerGroup: "無所属",
                    speakerPosition: "議長",
                    speakerRole: "None",
                    speech: "これより会議を開きます。..."
                }
            ]
        }
    },
    stats: {
        total_issues: 1,
        total_speeches: 2
    }
};

// Failed processing example
export const failedProcessResult: ProcessResult = {
    success: false,
    error: "Failed to parse JSON data"
};

// Multiple issues example
export const multiIssueProcessResult: ProcessResult = {
    success: true,
    data: {
        "121305254X00420240201": {
            imageKind: "会議録",
            session: 213,
            nameOfHouse: "衆議院",
            nameOfMeeting: "本会議",
            date: "2024-02-01",
            speeches: [/* ...speeches... */]
        },
        "121304024X00420240201": {
            imageKind: "会議録",
            session: 213,
            nameOfHouse: "衆議院",
            nameOfMeeting: "予算委員会",
            date: "2024-02-01",
            speeches: [/* ...speeches... */]
        }
    },
    stats: {
        total_issues: 2,
        total_speeches: 45
    }
};

// Example usage:
const handleProcessResult = (result: ProcessResult) => {
    if (!result.success) {
        console.error(`Processing failed: ${result.error}`);
        return;
    }

    console.log(`Successfully processed ${result.stats?.total_issues} issues`);
    console.log(`Total speeches processed: ${result.stats?.total_speeches}`);
    
    // Access specific issue data
    Object.entries(result.data || {}).forEach(([issueId, issue]) => {
        console.log(`Issue ${issueId}:`);
        console.log(`- Meeting: ${issue.nameOfMeeting}`);
        console.log(`- Date: ${issue.date}`);
        console.log(`- Number of speeches: ${issue.speeches.length}`);
    });
};
