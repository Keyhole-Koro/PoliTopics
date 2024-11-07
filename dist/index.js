/*
const filePath = "/workspaces/PoliTopics/src/samples/sample1.txt";  // Replace with your actual file path

// Read the .txt file and store its content in xmlData
fs.readFile(filePath, "utf8", (err, data) => {
  // Check for errors in reading the file
  if (err) {
    console.error(`Error reading file: ${err.message}`);
  } else {
    const xmlData = data;  // Store file data in xmlData variable

    // Now that the file is read, parse it using parserXML
    const parsedData = parserXML(xmlData);

    const conv = conversation(parsedData.records[0].recordData.speechRecords);


  }
});
*/
import generateSummery from "./gemini-handler/api";
const conv = `以下の会話内容について、次の形式で要約してください：

1. **全体の要約**：会話全体の要旨と結論を短くまとめてください。
2. **発言ごとの要約**：各発言の要点を簡潔に記載し、依存関係（質問と回答、主張と反論など）が分かるようにしてください。

### フォーマット

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

### 会話内容

[発言1]
**A議員**：「新しい経済政策についての政府の立場を伺いたい。」

[発言2]
**B大臣**：「経済政策は景気の持続的な回復を目的とし、特定の業界に焦点を当てています。」

[発言3]
**C議員**：「しかし、中小企業支援の具体策はまだ不明です。その点を詳しく説明いただけますか？」

[発言4]
**B大臣**：「中小企業支援については、補助金の拡充と税制の見直しを検討中です。」
`;
generateSummery(conv).then((res) => {
    console.log(res);
});
