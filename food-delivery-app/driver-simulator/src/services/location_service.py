import math
from geopy.distance import geodesic
from typing import Tuple

class LocationService:
    @staticmethod
    def calculate_distance(point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
        """Calculate distance between two points in kilometers"""
        return geodesic(point1, point2).kilometers
    
    @staticmethod
    def calculate_bearing(point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
        """Calculate bearing from point1 to point2 in degrees"""
        lat1 = math.radians(point1[0])
        lat2 = math.radians(point2[0])
        diff_long = math.radians(point2[1] - point1[1])
        
        x = math.sin(diff_long) * math.cos(lat2)
        y = math.cos(lat1) * math.sin(lat2) - (math.sin(lat1) * math.cos(lat2) * math.cos(diff_long))
        
        initial_bearing = math.atan2(x, y)
        compass_bearing = (math.degrees(initial_bearing) + 360) % 360
        
        return compass_bearing
    
    @staticmethod
    def is_within_radius(point1: Tuple[float, float], point2: Tuple[float, float], radius_km: float) -> bool:
        """Check if point1 is within radius_km of point2"""
        distance = LocationService.calculate_distance(point1, point2)
        return distance <= radius_km
    
    @staticmethod
    def estimate_travel_time(distance_km: float, speed_kmh: float) -> float:
        """Estimate travel time in minutes"""
        if speed_kmh <= 0:
            return float('inf')
        return (distance_km / speed_kmh) * 60