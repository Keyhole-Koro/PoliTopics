import fs from "fs";
import parserXML from "./parliament-handler/xml_parser";
import { conversation, Speech } from "./parliament-handler/prompts";

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
