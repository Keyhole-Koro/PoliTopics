export interface Speech {
    speechOrder: number;
    speaker: string;
    speakerYomi: string;
    speakerGroup: string;
    speakerPosition: string;
    speakerRole: string;
    speech: string;
}

export interface ProcessedIssue {
    imageKind: string;
    session: number;
    nameOfHouse: string;
    nameOfMeeting: string;
    date: string;
    speeches: Speech[];
}

export interface RawSpeech {
    speechID: string;
    issueID: string;
    imageKind: string;
    searchObject: number;
    session: number;
    nameOfHouse: string;
    nameOfMeeting: string;
    issue: string;
    date: string;
    closing: string;
    speechOrder: number;
    speaker: string;
    speakerYomi: string;
    speakerGroup: string;
    speakerPosition: string;
    speakerRole: string;
    speech: string;
    startPage: number;
    speechURL: string;
    meetingURL: string;
    pdfURL: string;
}

export interface RawData {
    numberOfRecords: number;
    numberOfReturn: number;
    startRecord: number;
    nextRecordPosition: number | null;
    speechRecord: RawSpeech[];
}

// Helper functions for data transformation
export const transformRawSpeechToSpeech = (raw: RawSpeech): Speech => ({
    speechOrder: raw.speechOrder,
    speaker: raw.speaker,
    speakerYomi: raw.speakerYomi,
    speakerGroup: raw.speakerGroup,
    speakerPosition: raw.speakerPosition,
    speakerRole: raw.speakerRole,
    speech: raw.speech
});

export const createProcessedIssue = (raw: RawSpeech, speeches: Speech[]): ProcessedIssue => ({
    imageKind: raw.imageKind,
    session: raw.session,
    nameOfHouse: raw.nameOfHouse,
    nameOfMeeting: raw.nameOfMeeting,
    date: raw.date,
    speeches: speeches
});

// Type guards for runtime type checking
export const isSpeech = (obj: any): obj is Speech => {
    return obj &&
        typeof obj.speechOrder === 'number' &&
        typeof obj.speaker === 'string' &&
        typeof obj.speakerYomi === 'string' &&
        typeof obj.speakerGroup === 'string' &&
        typeof obj.speakerPosition === 'string' &&
        typeof obj.speakerRole === 'string' &&
        typeof obj.speech === 'string';
};

export const isRawSpeech = (obj: any): obj is RawSpeech => {
    return obj &&
        typeof obj.speechID === 'string' &&
        typeof obj.issueID === 'string' &&
        typeof obj.imageKind === 'string' &&
        typeof obj.searchObject === 'number' &&
        typeof obj.session === 'number' &&
        typeof obj.date === 'string' &&
        typeof obj.speechOrder === 'number';
};
