import requests
import time
import os

# Base URL for the API endpoint (replace with the actual URL)
base_url = "https://kokkai.ndl.go.jp/api/speech"  # Replace with the correct URL

# Parameters for the request
params = {
    "startRecord": 1,              # Start fetching from the first record
    "maximumRecords": 10,          # Limit the number of records per request
    "recordPacking": "json"        # Output format (json)
}

# Local folder to save the fetched data
local_folder = "data_2024"
if not os.path.exists(local_folder):
    os.makedirs(local_folder)

# List of date ranges to query
date_ranges = [
    {"from": "2024-01-01", "until": "2024-02-01"},
    {"from": "2024-02-01", "until": "2024-03-01"},
    {"from": "2024-03-01", "until": "2024-04-01"},
    {"from": "2024-04-01", "until": "2024-05-01"},
    {"from": "2024-05-01", "until": "2024-06-01"},
    {"from": "2024-06-01", "until": "2024-07-01"},
    {"from": "2024-07-01", "until": "2024-08-01"},
    {"from": "2024-08-01", "until": "2024-09-01"},
    {"from": "2024-09-01", "until": "2024-10-01"},
    {"from": "2024-10-01", "until": "2024-11-01"},
    {"from": "2024-11-01", "until": "2024-12-01"},
    {"from": "2024-12-01", "until": "2024-12-31"},
    {"from": "2025-01-01", "until": "2025-02-01"},
    {"from": "2025-02-01", "until": "2025-03-01"},
    {"from": "2025-03-01", "until": "2025-03-06"}  # Adjusted for today's date'''
]

def fetch_data(from_date, until_date, start_record):
    """Fetch data from the API with specific date range and record offset."""
    params["from"] = from_date
    params["until"] = until_date
    params["startRecord"] = start_record
    try:
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            return response.json()  # Assuming the API returns JSON data
        else:
            print(f"Failed to fetch data for {from_date} to {until_date}, status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching data for {from_date} to {until_date}: {e}")
        return None

def save_data(data, from_date, until_date, start_record):
    """Save the fetched data to a local file."""
    file_name = f"data_{from_date}_{until_date}_{start_record}.json"
    file_path = os.path.join(local_folder, file_name)
    try:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(str(data))
        print(f"Data saved to {file_path}")
    except Exception as e:
        print(f"Error saving data: {e}")

def fetch_all_data():
    """Fetch all data in smaller chunks by splitting date ranges."""
    for date_range in date_ranges:
        from_date = date_range["from"]
        until_date = date_range["until"]
        
        start_record = 1
        while True:
            # Fetch data for the current date range
            data = fetch_data(from_date, until_date, start_record)
            if data:
                save_data(data, from_date, until_date, start_record)
                
                # Check if the response contains less than the requested number of records
                if len(data) < params["maximumRecords"]:
                    print(f"All available data fetched for {from_date} to {until_date}.")
                    break
                
                # Increase the start record for the next batch of data
                start_record += params["maximumRecords"]
            else:
                print(f"No data fetched or an error occurred for {from_date} to {until_date}.")
                break
            
            # Sleep between requests to avoid overwhelming the server
            time.sleep(10)  # Adjust sleep time if needed

if __name__ == "__main__":
    fetch_all_data()
