class SpeechRecord {
  speechID: string;
  speechOrder: number;
  speaker: string;
  speakerYomi: string;
  speakerGroup: string;
  speakerPosition: string;
  speech: string;
  startPage: number;
  createTime: Date;
  updateTime: Date;
  speechURL: string;

  constructor(
      speechID: string,
      speechOrder: number,
      speaker: string,
      speakerYomi: string,
      speakerGroup: string,
      speakerPosition: string,
      speech: string,
      startPage: number,
      createTime: Date,
      updateTime: Date,
      speechURL: string
  ) {
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
  issueID: string;
  imageKind: string;
  searchObject: string;
  session: string;
  nameOfHouse: string;
  nameOfMeeting: string;
  issue: string;
  date: Date;
  closing: boolean;
  speechRecords: SpeechRecord[];
  meetingURL: string;
  pdfURL: string;

  constructor(
      issueID: string,
      imageKind: string,
      searchObject: string,
      session: string,
      nameOfHouse: string,
      nameOfMeeting: string,
      issue: string,
      date: Date,
      closing: boolean,
      speechRecords: SpeechRecord[],
      meetingURL: string,
      pdfURL: string
  ) {
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
  recordData: MeetingRecord;

  constructor(recordData: MeetingRecord) {
      this.recordData = recordData;
  }
}

class ParsedData {
  numberOfRecords: number;
  numberOfReturn: number;
  startRecord: number;
  nextRecordPosition: number;
  records: Record[];

  constructor(
      numberOfRecords: number,
      numberOfReturn: number,
      startRecord: number,
      nextRecordPosition: number,
      records: Record[]
  ) {
      this.numberOfRecords = numberOfRecords;
      this.numberOfReturn = numberOfReturn;
      this.startRecord = startRecord;
      this.nextRecordPosition = nextRecordPosition;
      this.records = records;
  }
}

export { SpeechRecord, MeetingRecord, Record, ParsedData };
