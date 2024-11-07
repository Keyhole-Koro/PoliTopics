class SpeechRecord {
    constructor(speechID, speechOrder, speaker, speakerYomi, speakerGroup, speakerPosition, speech, startPage, createTime, updateTime, speechURL) {
        this.speechID = speechID;
        this.speechOrder = speechOrder;
        this.speaker = speaker;
        this.speakerYomi = speakerYomi;
        this.speakerGroup = speakerGroup;
        this.speakerPosition = speakerPosition;
        this.speech = speech;
        this.startPage = startPage;
        this.createTime = createTime;
        this.updateTime = updateTime;
        this.speechURL = speechURL;
    }
}
class MeetingRecord {
    constructor(issueID, imageKind, searchObject, session, nameOfHouse, nameOfMeeting, issue, date, closing, speechRecords, meetingURL, pdfURL) {
        this.issueID = issueID;
        this.imageKind = imageKind;
        this.searchObject = searchObject;
        this.session = session;
        this.nameOfHouse = nameOfHouse;
        this.nameOfMeeting = nameOfMeeting;
        this.issue = issue;
        this.date = date;
        this.closing = closing;
        this.speechRecords = speechRecords;
        this.meetingURL = meetingURL;
        this.pdfURL = pdfURL;
    }
}
class Record {
    constructor(recordData) {
        this.recordData = recordData;
    }
}
class ParsedData {
    constructor(numberOfRecords, numberOfReturn, startRecord, nextRecordPosition, records) {
        this.numberOfRecords = numberOfRecords;
        this.numberOfReturn = numberOfReturn;
        this.startRecord = startRecord;
        this.nextRecordPosition = nextRecordPosition;
        this.records = records;
    }
}
export { SpeechRecord, MeetingRecord, Record, ParsedData };
