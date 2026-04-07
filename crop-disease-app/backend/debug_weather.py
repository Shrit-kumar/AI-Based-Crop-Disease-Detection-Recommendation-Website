import os
import requests
from dotenv import load_dotenv


api_key = "26cbf86303cb4eb190c165734250412"
print(f"API Key: {api_key}")

lat = 22.7195687
lon = 75.8577258

url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="
params = {
    'key': api_key,
    'q': f"{lat},{lon}",
    'aqi': 'no'
}

try:
    print(f"Requesting URL: {url} with params: {params}")
    response = requests.get(url, params=params, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response Text: {response.text}")
    response.raise_for_status()
    data = response.json()
    print("Success!")
    print(data)
except Exception as e:
    print(f"Error: {e}")
