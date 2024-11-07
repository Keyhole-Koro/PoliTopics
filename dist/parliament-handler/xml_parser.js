import { DOMParser } from 'xmldom';
import { ParsedData, Record, MeetingRecord, SpeechRecord } from './type/records';
// Function to Parse XML
export default function parseXML(xmlString) {
    // Create a new DOMParser instance to parse the XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    // Extract data for the outermost <data> element
    const numberOfRecords = parseInt(xmlDoc.getElementsByTagName("numberOfRecords")[0].textContent || "0");
    const numberOfReturn = parseInt(xmlDoc.getElementsByTagName("numberOfReturn")[0].textContent || "0");
    const startRecord = parseInt(xmlDoc.getElementsByTagName("startRecord")[0].textContent || "0");
    const nextRecordPosition = parseInt(xmlDoc.getElementsByTagName("nextRecordPosition")[0].textContent || "0");
    // Extract all <record> elements
    const records = Array.from(xmlDoc.getElementsByTagName("record")).map(recordElement => {
        var _a;
        const recordDataElement = recordElement.getElementsByTagName("recordData")[0];
        const meetingRecordElement = recordDataElement.getElementsByTagName("meetingRecord")[0];
        // Extract meetingRecord data
        const issueID = meetingRecordElement.getElementsByTagName("issueID")[0].textContent || "";
        const imageKind = meetingRecordElement.getElementsByTagName("imageKind")[0].textContent || "";
        const searchObject = meetingRecordElement.getElementsByTagName("searchObject")[0].textContent || "";
        const session = meetingRecordElement.getElementsByTagName("session")[0].textContent || "";
        const nameOfHouse = meetingRecordElement.getElementsByTagName("nameOfHouse")[0].textContent || "";
        const nameOfMeeting = meetingRecordElement.getElementsByTagName("nameOfMeeting")[0].textContent || "";
        const issue = meetingRecordElement.getElementsByTagName("issue")[0].textContent || "";
        const date = new Date(meetingRecordElement.getElementsByTagName("date")[0].textContent || "");
        const closing = ((_a = meetingRecordElement.getElementsByTagName("closing")[0]) === null || _a === void 0 ? void 0 : _a.textContent) === "true";
        const meetingURL = meetingRecordElement.getElementsByTagName("meetingURL")[0].textContent || "";
        const pdfURL = meetingRecordElement.getElementsByTagName("pdfURL")[0].textContent || "";
        // Extract speechRecords
        const speechRecords = Array.from(meetingRecordElement.getElementsByTagName("speechRecord")).map(speechElement => {
            var _a, _b, _c;
            const speechID = speechElement.getElementsByTagName("speechID")[0].textContent || "";
            const speechOrder = parseInt(speechElement.getElementsByTagName("speechOrder")[0].textContent || "0");
            const speaker = speechElement.getElementsByTagName("speaker")[0].textContent || "";
            const speakerYomi = ((_a = speechElement.getElementsByTagName("speakerYomi")[0]) === null || _a === void 0 ? void 0 : _a.textContent) || "";
            const speakerGroup = ((_b = speechElement.getElementsByTagName("speakerGroup")[0]) === null || _b === void 0 ? void 0 : _b.textContent) || "";
            const speakerPosition = ((_c = speechElement.getElementsByTagName("speakerPosition")[0]) === null || _c === void 0 ? void 0 : _c.textContent) || "";
            const speech = speechElement.getElementsByTagName("speech")[0].textContent || "";
            const startPage = parseInt(speechElement.getElementsByTagName("startPage")[0].textContent || "0");
            const createTime = new Date(speechElement.getElementsByTagName("createTime")[0].textContent || "");
            const updateTime = new Date(speechElement.getElementsByTagName("updateTime")[0].textContent || "");
            const speechURL = speechElement.getElementsByTagName("speechURL")[0].textContent || "";
            return new SpeechRecord(speechID, speechOrder, speaker, speakerYomi, speakerGroup, speakerPosition, speech, startPage, createTime, updateTime, speechURL);
        });
        const meetingRecord = new MeetingRecord(issueID, imageKind, searchObject, session, nameOfHouse, nameOfMeeting, issue, date, closing, speechRecords, meetingURL, pdfURL);
        return new Record(meetingRecord);
    });
    // Return the parsed data
    return new ParsedData(numberOfRecords, numberOfReturn, startRecord, nextRecordPosition, records);
}
