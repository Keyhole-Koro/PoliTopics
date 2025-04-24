export const instruction = `以下の会話内容を基に、次の形式で要約データを構成してください：

1. **全体の要約**（Summary）：会話全体の要点と結論を簡潔に記述してください。
2. **中間要約**（MiddleSummary）：議論の重要な段階ごとに、要点をまとめてください。
3. **発言ごとの要約**（Dialog）：発言の主旨、話者、発言順序、関連する発言（応答元）を記載してください。
4. **参加者情報**（Participant）：主要な話者とその役割、発言の要旨をまとめてください。
5. **用語の解説**（Term）：一般人には分かりにくい専門用語をリストアップし、簡潔に解説してください。
6. **キーワード抽出**（Keyword）：議論の焦点となるキーワードを優先度付きで抽出してください。

`;

export const output_format = `### 出力フォーマット

{
  "summary": {
    "id": 1,
    "summary": "会話全体の要約をここに記載",
    "figure": "Markdown形式で図や補足を記載（任意）"
  },
  "middle_summary": [
    {
      "order": 1,
      "summary": "中間要約1",
      "figure": "Markdown形式（任意）"
    },
    ...
  ],
  "dialogs": [
    {
      "order": 1,
      "speaker": "発言者名",
      "speaker_group": "所属",
      "speaker_position": "役職",
      "speaker_role": "役割",
      "summary": "発言内容の要約",
      "response_to": [
        {
          "id": 発言ID,
          "reaction": "agree | disagree | neutral | question | answer"
        }
      ]
    },
    ...
  ],
  "participants": [
    {
      "name": "話者名",
      "summary": "この人の発言要旨"
    }
  ],
  "terms": [
    {
      "term": "専門用語",
      "definition": "その説明"
    }
  ],
  "keywords": [
    {
      "keyword": "キーワード",
      "priority": "high | medium | low"
    }
  ]
}
`;


export const compose_prompt = (content: string): string => {
  return `${instruction}${content}${output_format}`;
}
