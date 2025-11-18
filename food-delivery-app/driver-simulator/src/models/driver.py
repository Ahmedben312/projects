import random
import math
from dataclasses import dataclass, field
from typing import Optional, Tuple
from datetime import datetime

@dataclass
class Driver:
    driver_id: str
    city: str
    base_location: Tuple[float, float]
    status: str = "AVAILABLE"
    current_location: Tuple[float, float] = field(init=False)
    current_order_id: Optional[str] = None
    speed_kmh: float = field(default_factory=lambda: random.uniform(5, 35))
    bearing: float = field(default_factory=lambda: random.uniform(0, 360))
    last_updated: datetime = field(default_factory=datetime.now)
    total_deliveries: int = 0
    is_active: bool = True
    
    def __post_init__(self):
        # Initialize driver at a random location near base
        lat_offset = random.uniform(-0.01, 0.01)
        lng_offset = random.uniform(-0.01, 0.01)
        self.current_location = (
            self.base_location[0] + lat_offset,
            self.base_location[1] + lng_offset
        )
    
    def move(self, destination: Optional[Tuple[float, float]] = None):
        """Move driver towards destination or randomly"""
        if destination and self.status in ["ASSIGNED", "BUSY"]:
            # Move towards destination
            self._move_towards_destination(destination)
        else:
            # Random wandering
            self._wander_randomly()
        
        self.last_updated = datetime.now()
    
    def _move_towards_destination(self, destination: Tuple[float, float]):
        """Move driver towards a specific destination"""
        current_lat, current_lng = self.current_location
        dest_lat, dest_lng = destination
        
        # Calculate bearing to destination
        bearing = self._calculate_bearing(current_lat, current_lng, dest_lat, dest_lng)
        self.bearing = bearing
        
        # Calculate distance to move (3 seconds of movement)
        distance_km = (self.speed_kmh / 3600) * 3
        distance_deg = distance_km / 111  # Approximate degrees per km
        
        # Move towards destination
        new_lat, new_lng = self._calculate_new_position(
            current_lat, current_lng, bearing, distance_deg
        )
        
        self.current_location = (new_lat, new_lng)
    
    def _wander_randomly(self):
        """Move driver in a random direction"""
        # Slightly change bearing
        self.bearing += random.uniform(-30, 30)
        
        # Calculate random movement
        distance_km = (self.speed_kmh / 3600) * 3
        distance_deg = distance_km / 111
        
        current_lat, current_lng = self.current_location
        new_lat, new_lng = self._calculate_new_position(
            current_lat, current_lng, self.bearing, distance_deg
        )
        
        self.current_location = (new_lat, new_lng)
    
    def _calculate_bearing(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate bearing from point1 to point2 in degrees"""
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        lng_diff_rad = math.radians(lng2 - lng1)
        
        x = math.sin(lng_diff_rad) * math.cos(lat2_rad)
        y = math.cos(lat1_rad) * math.sin(lat2_rad) - (
            math.sin(lat1_rad) * math.cos(lat2_rad) * math.cos(lng_diff_rad)
        )
        
        initial_bearing = math.atan2(x, y)
        compass_bearing = (math.degrees(initial_bearing) + 360) % 360
        
        return compass_bearing
    
    def _calculate_new_position(self, lat: float, lng: float, bearing: float, distance_deg: float) -> Tuple[float, float]:
        """Calculate new position based on bearing and distance"""
        lat_rad = math.radians(lat)
        lng_rad = math.radians(lng)
        bearing_rad = math.radians(bearing)
        
        new_lat = math.asin(
            math.sin(lat_rad) * math.cos(distance_deg) +
            math.cos(lat_rad) * math.sin(distance_deg) * math.cos(bearing_rad)
        )
        
        new_lng = lng_rad + math.atan2(
            math.sin(bearing_rad) * math.sin(distance_deg) * math.cos(lat_rad),
            math.cos(distance_deg) - math.sin(lat_rad) * math.sin(new_lat)
        )
        
        return (math.degrees(new_lat), math.degrees(new_lng))
    
    def to_dict(self):
        """Convert driver to dictionary for MongoDB"""
        return {
            'driverId': self.driver_id,
            'name': f"Driver {self.driver_id}",
            'city': self.city,
            'location': {
                'type': 'Point',
                'coordinates': [self.current_location[1], self.current_location[0]]  # GeoJSON: [lng, lat]
            },
            'status': self.status,
            'currentOrder': self.current_order_id,
            'vehicle': {
                'type': random.choice(['car', 'motorcycle', 'bicycle', 'scooter']),
                'make': 'Generic',
                'model': 'Delivery',
                'color': random.choice(['Red', 'Blue', 'Green', 'Black', 'White'])
            },
            'isActive': self.is_active,
            'totalDeliveries': self.total_deliveries,
            'lastActive': self.last_updated
        }