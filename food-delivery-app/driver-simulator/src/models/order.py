from dataclasses import dataclass
from typing import Tuple, Optional
from datetime import datetime

@dataclass
class Order:
    order_id: str
    restaurant_location: Tuple[float, float]
    delivery_location: Tuple[float, float]
    status: str = "PENDING"
    driver_id: Optional[str] = None
    created_at: datetime = None
    assigned_at: Optional[datetime] = None
    picked_up_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
    
    def assign_driver(self, driver_id: str):
        """Assign a driver to this order"""
        self.driver_id = driver_id
        self.status = "ASSIGNED"
        self.assigned_at = datetime.now()
    
    def mark_picked_up(self):
        """Mark order as picked up"""
        self.status = "PICKED_UP"
        self.picked_up_at = datetime.now()
    
    def mark_delivered(self):
        """Mark order as delivered"""
        self.status = "DELIVERED"
        self.delivered_at = datetime.now()
    
    def to_dict(self):
        """Convert order to dictionary"""
        return {
            '_id': self.order_id,
            'status': self.status,
            'driverId': self.driver_id,
            'assignedAt': self.assigned_at,
            'pickedUpAt': self.picked_up_at,
            'deliveredAt': self.delivered_at
        }