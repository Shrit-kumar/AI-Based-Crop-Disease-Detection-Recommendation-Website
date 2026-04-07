"""
Weather API service using OpenWeatherMap
"""
import os
import requests
from datetime import datetime

def get_mock_weather():
    """Return mock weather data"""
    return {
        'location': 'Bhopal (Mock)',
        'temperature': 28,
        'feels_like': 30,
        'temp_min': 24,
        'temp_max': 32,
        'humidity': 65,
        'pressure': 1013,
        'description': 'Partly Cloudy',
        'icon': '02d',
        'wind_speed': 12.5,
        'timestamp': datetime.now().isoformat(),
        'mock': True
    }

def get_weather(lat, lon):
    """
    Fetch weather data for given coordinates using Open-Meteo (No Key) and Nominatim (Reverse Geocoding)
    
    Args:
        lat: Latitude
        lon: Longitude
        
    Returns:
        dict: Weather data including temperature, conditions, etc.
    """
    try:
        # 1. Get Weather from Open-Meteo
        weather_url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
        }
        
        w_response = requests.get(weather_url, params=params, timeout=10)
        w_response.raise_for_status()
        w_data = w_response.json()
        current = w_data.get("current", {})
        
        # Map WMO weather codes to text/icon
        # https://open-meteo.com/en/docs
        wmo_code = current.get("weather_code", 0)
        condition_text = "Clear"
        condition_icon = "01d" # default sun
        
        # Simple mapping
        if wmo_code in [0]:
            condition_text = "Clear Sky"
            condition_icon = "01d"
        elif wmo_code in [1, 2, 3]:
            condition_text = "Partly Cloudy"
            condition_icon = "02d"
        elif wmo_code in [45, 48]:
            condition_text = "Foggy"
            condition_icon = "50d"
        elif wmo_code in [51, 53, 55, 61, 63, 65]:
            condition_text = "Rainy"
            condition_icon = "10d"
        elif wmo_code >= 95:
            condition_text = "Thunderstorm" 
            condition_icon = "11d"
            
        # 2. Get Location Name from Nominatim (OpenStreetMap)
        # Note: Nominatim requires a valid User-Agent
        geo_url = "https://nominatim.openstreetmap.org/reverse"
        geo_params = {
            "lat": lat,
            "lon": lon,
            "format": "json"
        }
        geo_headers = {
            "User-Agent": "CropDiseaseApp/1.0" 
        }
        
        location_name = f"{lat}, {lon}"
        try:
            g_response = requests.get(geo_url, params=geo_params, headers=geo_headers, timeout=5)
            if g_response.ok:
                address = g_response.json().get("address", {})
                # Try to get city, town, village, or state
                location_name = address.get("city") or address.get("town") or address.get("village") or address.get("county") or "Unknown Location"
        except Exception as e:
            print(f"Geocoding error: {e}")

        # Format the response
        weather_data = {
            'location': location_name,
            'temperature': round(current.get("temperature_2m", 0)),
            'feels_like': round(current.get("apparent_temperature", 0)),
            'temp_min': round(current.get("temperature_2m", 0) - 2), # Estimation
            'temp_max': round(current.get("temperature_2m", 0) + 2), 
            'humidity': current.get("relative_humidity_2m", 0),
            'pressure': 1013, # Not provided by default free API
            'description': condition_text,
            'icon': f"//cdn.weatherapi.com/weather/64x64/day/{condition_icon.replace('d','')}.png", # fallback icon url usage
            'wind_speed': round(current.get("wind_speed_10m", 0), 1),
            'timestamp': datetime.now().isoformat(),
            'mock': False
        }
        
        return weather_data
        
    except Exception as e:
        print(f"Weather API error: {str(e)}. Falling back to mock data.")
        return get_mock_weather()
