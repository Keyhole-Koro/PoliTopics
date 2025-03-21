from pathlib import Path
import json
import logging
from collections import defaultdict
from ...src.interfaces.speech import Speech, ProcessedIssue, RawSpeech, RawData

def clean_text(text: str) -> str:
    """Clean speech text by replacing special characters"""
    return text.replace('\r\n', '\n').replace('\u3000', ' ')

class SpeechProcessor:
    def convert_raw_speech(self, raw: RawSpeech) -> Speech:
        """Convert raw speech data to processed format"""
        return Speech(
            speechOrder=raw.speechOrder,
            speaker=raw.speaker,
            speakerYomi=raw.speakerYomi,
            speakerGroup=raw.speakerGroup,
            speakerPosition=raw.speakerPosition,
            speakerRole=raw.speakerRole,
            speech=clean_text(raw.speech)
        )

    def create_issue(self, first_speech: RawSpeech, speeches: List[Speech]) -> ProcessedIssue:
        """Create processed issue from raw data"""
        return ProcessedIssue(
            imageKind=first_speech.imageKind,
            session=first_speech.session,
            nameOfHouse=first_speech.nameOfHouse,
            nameOfMeeting=first_speech.nameOfMeeting,
            date=first_speech.date,
            speeches=sorted(speeches, key=lambda x: x.speechOrder)
        )

    def process_data(self, data: dict) -> dict[str, ProcessedIssue]:
        """Process raw JSON data into structured format"""
        raw_data = RawData(**data)
        speeches_by_issue = defaultdict(list)
        
        for raw_speech in raw_data.speechRecord:
            speech = RawSpeech(**raw_speech)
            processed_speech = self.convert_raw_speech(speech)
            speeches_by_issue[speech.issueID].append(processed_speech)
        
        return {
            issue_id: self.create_issue(
                next(s for s in raw_data.speechRecord if s['issueID'] == issue_id),
                speeches
            )
            for issue_id, speeches in speeches_by_issue.items()
        }

    def process_file(self, input_file: Path, output_dir: Path) -> bool:
        """Process a single JSON file"""
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            processed_data = self.process_data(data)
            output_dir = Path(output_dir)
            output_dir.mkdir(parents=True, exist_ok=True)
            
            for issue_id, issue_data in processed_data.items():
                output_file = output_dir / f"{issue_id}_formatted.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(issue_data.__dict__, f, ensure_ascii=False, indent=2)
                logging.info(f"Created {output_file}")
            
            return True
        except Exception as e:
            logging.error(f"Error processing {input_file}: {e}")
            return False
