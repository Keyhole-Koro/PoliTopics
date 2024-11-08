import * as fs from 'fs';
import { SpeechRecord } from './type/records';

export const instruction = `以下の会話内容について、次の形式で要約してください：

1. **全体の要約**：会話全体の要旨と結論を短くまとめてください。
2. **発言ごとの要約**：各発言の要点を簡潔に記載し、依存関係（質問と回答、主張と反論など）が分かるようにしてください。

`;

export const output = `### フォーマット

{
  "overall_summary": "ここに全体の要約を記載してください。",
  "individual_summaries": [
    {
      "id": 発言ID,
      "speaker": "発言者名",
      "summary": "発言内容の要約",
      "response_to": 依存先の発言ID（無い場合はnull）
    },
    ...
  ]
}
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