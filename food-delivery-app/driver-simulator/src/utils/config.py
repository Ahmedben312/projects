import json
import os
from typing import Dict, Any

class Config:
    def __init__(self, config_path: str = None):
        if config_path is None:
            config_path = os.path.join(os.path.dirname(__file__), '../../config.json')
        
        with open(config_path, 'r') as file:
            self.config = json.load(file)
    
    @property
    def mongo_uri(self) -> str:
        return self.config['mongo']['uri']
    
    @property
    def database_name(self) -> str:
        return self.config['mongo']['database']
    
    @property
    def simulation_update_interval(self) -> int:
        return self.config['simulation']['update_interval']
    
    @property
    def simulation_speed_factor(self) -> float:
        return self.config['simulation']['speed_factor']
    
    @property
    def cities(self) -> Dict[str, Any]:
        return self.config['cities']
    
    @property
    def drivers_per_city(self) -> int:
        return self.config['drivers']['count_per_city']
    
    @property
    def driver_speed_range(self) -> tuple:
        speed_range = self.config['drivers']['speed_range']
        return (speed_range[0], speed_range[1])
    
    @property
    def max_assign_distance(self) -> float:
        return self.config['orders']['max_assign_distance']