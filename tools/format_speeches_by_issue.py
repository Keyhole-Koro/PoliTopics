import json
from collections import defaultdict
from pathlib import Path
import argparse
import logging

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('format_speeches.log'),
            logging.StreamHandler()
        ]
    )

def clean_text(text):
    """Clean speech text by replacing special characters"""
    return text.replace('\r\n', '\n').replace('\u3000', ' ')

def format_issue_data(speeches):
    """Format a group of speeches into the new structure"""
    if not speeches:
        return None
        
    # Take common metadata from first speech
    first_speech = speeches[0]
    return {
        "imageKind": first_speech["imageKind"],
        "session": first_speech["session"],
        "nameOfHouse": first_speech["nameOfHouse"], 
        "nameOfMeeting": first_speech["nameOfMeeting"],
        "date": first_speech["date"],
        "speeches": [
            {
                "speechOrder": s["speechOrder"],
                "speaker": s["speaker"],
                "speakerYomi": s["speakerYomi"],
                "speakerGroup": s["speakerGroup"], 
                "speakerPosition": s["speakerPosition"],
                "speakerRole": s["speakerRole"],
                "speech": clean_text(s["speech"])
            }
            for s in sorted(speeches, key=lambda x: x["speechOrder"])
        ]
    }

def group_speeches_by_issue(data):
    """Group speeches by issueID and format them"""
    speeches_by_issue = defaultdict(list)
    
    # Handle either direct speechRecord or meetingRecord containing speechRecord
    if 'meetingRecord' in data:
        for meeting in data['meetingRecord']:
            for speech in meeting['speechRecord']:
                issue_id = speech['issueID']
                speeches_by_issue[issue_id].append(speech)
    elif 'speechRecord' in data:
        for speech in data['speechRecord']:
            issue_id = speech['issueID']
            speeches_by_issue[issue_id].append(speech)
    
    # Format each issue group
    result = {}
    for issue_id, speeches in speeches_by_issue.items():
        formatted_data = format_issue_data(speeches)
        if formatted_data:
            result[issue_id] = formatted_data
    
    return result

def process_json_data(json_data):
    """Process JSON data directly and return formatted data"""
    try:
        # Format speeches into new structure
        formatted_data = group_speeches_by_issue(json_data)
        
        # Return formatted results
        return {
            'success': True,
            'data': formatted_data,
            'stats': {
                'total_issues': len(formatted_data),
                'total_speeches': sum(len(issue_data['speeches']) 
                                    for issue_data in formatted_data.values())
            }
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def process_json_file(input_file, output_dir):
    """Process JSON file and write formatted output"""
    try:
        # Read JSON file
        with open(input_file, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        # Process the JSON data
        result = process_json_data(json_data)
        if not result['success']:
            raise Exception(result['error'])
            
        formatted_data = result['data']
        
        # Create output directory if it doesn't exist
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Write each issue group to a separate file
        for issue_id, issue_data in formatted_data.items():
            output_file = output_dir / f"{issue_id}_formatted.json"
            
            # If file exists, merge speeches with existing data
            if output_file.exists():
                with open(output_file, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
                
                # Create lookup of existing speeches
                existing_speeches = {s['speechOrder']: s for s in existing_data['speeches']}
                
                # Merge with new speeches
                new_speeches = {s['speechOrder']: s for s in issue_data['speeches']}
                existing_speeches.update(new_speeches)
                
                # Sort merged speeches
                issue_data['speeches'] = sorted(
                    existing_speeches.values(),
                    key=lambda x: x['speechOrder']
                )
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(issue_data, f, ensure_ascii=False, indent=2)
            
            logging.info(f"Created/Updated {output_file} with {len(issue_data['speeches'])} speeches")
        
        return True
    except Exception as e:
        logging.error(f"Error processing {input_file}: {e}")
        return False

def process_folder(folder_path, output_dir):
    """Process all JSON files in specified folder"""
    folder = Path(folder_path)
    if not folder.exists():
        logging.error(f"Folder not found: {folder}")
        return

    processed = 0
    failed = 0
    
    # Process all JSON files in the folder
    for json_file in folder.glob('*.json'):
        if '_formatted' not in json_file.name:  # Skip already processed files
            try:
                process_json_file(json_file, output_dir)
                processed += 1
            except Exception as e:
                logging.error(f"Failed to process {json_file}: {e}")
                failed += 1
    
    logging.info(f"Processing complete. Processed: {processed}, Failed: {failed}")

def parse_args():
    parser = argparse.ArgumentParser(description='Format speech JSON files by issue')
    parser.add_argument('folder', help='Folder containing JSON files to process')
    parser.add_argument('--output-dir', default='formatted_speeches',
                      help='Output directory (default: formatted_speeches)')
    return parser.parse_args()

def main():
    args = parse_args()
    setup_logging()
    process_folder(args.folder, args.output_dir)

if __name__ == "__main__":
    main()
