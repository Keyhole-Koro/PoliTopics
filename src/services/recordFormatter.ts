import { RawData, RawSpeech, Speech, ProcessedIssue } from '@interfaces/Speech';
import fs from 'fs/promises';
import path from 'path';
import winston from 'winston';

export interface ProcessResult {
    success: boolean;
    data?: Record<string, ProcessedIssue>;
    error?: string;
    stats?: {
        total_issues: number;
        total_speeches: number;
    };
}

export default class SpeechFormatter {

    private cleanText(text: string): string {
        return text.replace(/\r\n/g, '\n').replace(/\u3000/g, ' ');
    }

    private formatIssueData(speeches: RawSpeech[]): ProcessedIssue | null {
        if (!speeches.length) return null;

        const firstSpeech = speeches[0];
        return {
            imageKind: firstSpeech.imageKind,
            session: firstSpeech.session,
            nameOfHouse: firstSpeech.nameOfHouse,
            nameOfMeeting: firstSpeech.nameOfMeeting,
            date: firstSpeech.date,
            speeches: speeches
                .sort((a, b) => a.speechOrder - b.speechOrder)
                .map(s => ({
                    speechOrder: s.speechOrder,
                    speaker: s.speaker,
                    speakerYomi: s.speakerYomi,
                    speakerGroup: s.speakerGroup,
                    speakerPosition: s.speakerPosition,
                    speakerRole: s.speakerRole,
                    speech: this.cleanText(s.speech)
                }))
        };
    }

    private groupSpeechesByIssue(data: RawData): Record<string, ProcessedIssue> {
        const speechesByIssue = new Map<string, RawSpeech[]>();

        data.speechRecord.forEach(speech => {
            const speeches = speechesByIssue.get(speech.issueID) || [];
            speeches.push(speech);
            speechesByIssue.set(speech.issueID, speeches);
        });

        const result: Record<string, ProcessedIssue> = {};
        for (const [issueId, speeches] of speechesByIssue) {
            const formatted = this.formatIssueData(speeches);
            if (formatted) {
                result[issueId] = formatted;
            }
        }

        return result;
    }

    public processData(jsonData: RawData): ProcessResult {
        try {
            const formattedData = this.groupSpeechesByIssue(jsonData);
            return {
                success: true,
                data: formattedData,
                stats: {
                    total_issues: Object.keys(formattedData).length,
                    total_speeches: Object.values(formattedData)
                        .reduce((sum, issue) => sum + issue.speeches.length, 0)
                }
            };
        } catch (e) {
            return {
                success: false,
                error: e instanceof Error ? e.message : 'Unknown error'
            };
        }
    }
}
