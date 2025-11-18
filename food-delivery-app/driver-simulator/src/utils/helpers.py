import random
from typing import Tuple

def generate_driver_id(city: str, index: int) -> str:
    """Generate a driver ID based on city and index"""
    city_code = 'SFX' if city.lower() == 'sfax' else 'NYC'
    return f"{city_code}{index:03d}"

def random_location(center: Tuple[float, float], radius: float) -> Tuple[float, float]:
    """Generate a random location within radius of center (in degrees)"""
    lat = center[0] + random.uniform(-radius, radius)
    lng = center[1] + random.uniform(-radius, radius)
    return (lat, lng)

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula"""
    from math import radians, sin, cos, sqrt, atan2
    
    R = 6371  # Earth radius in kilometers
    
    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)
    
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    
    a = sin(dlat/2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    
    return R * c

def format_duration(minutes: float) -> str:
    """Format duration in minutes to human readable string"""
    if minutes < 60:
        return f"{int(minutes)} min"
    else:
        hours = minutes / 60
        return f"{hours:.1f} hours"