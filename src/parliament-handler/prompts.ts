import * as fs from 'fs';
import { SpeechRecord } from './type/records';

export const instruction = `「以下の会話について、次の要約を作成してください：
全体の要約：会話全体の流れと結論がわかるように、全体の要旨を短くまとめてください。
発言ごとの要約：各発言を簡潔にまとめ、誰が何を述べたかを記載してください。依存関係（質問と回答、主張と反論など）も考慮し、前後の関係がわかるようにしてください。
`;


// Define a type for the speech content
export interface Speech {
    speech_id: number;
    speaker: string;
    content: string;
}

export function conversation(speechRecords: SpeechRecord[]): Speech[] {
    let speech_id = 0;
    const speeches: Speech[] = speechRecords.map((speechRecord) => {
        const speaker = speechRecord.speaker;
        const content = speechRecord.speech;
        const speech: Speech = { speech_id, speaker, content };
        speech_id++;
        console.log(speech);
        return speech;
    });

    return speeches;
  }