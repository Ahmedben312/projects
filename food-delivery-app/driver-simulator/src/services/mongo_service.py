import pymongo
from typing import List, Optional, Dict, Any
from src.models.driver import Driver
from src.models.order import Order

class MongoService:
    def __init__(self, connection_uri: str):
        self.client = pymongo.MongoClient(connection_uri)
        self.db = self.client.fooddelivery
    
    def initialize_drivers(self, drivers: List[Driver]):
        """Initialize drivers in the database"""
        collection = self.db.drivers
        
        # Clear existing drivers
        collection.delete_many({})
        
        driver_docs = [driver.to_dict() for driver in drivers]
        if driver_docs:
            collection.insert_many(driver_docs)
    
    def update_driver_location(self, driver: Driver):
        """Update driver location in database"""
        collection = self.db.drivers
        collection.update_one(
            {'driverId': driver.driver_id},
            {'$set': {
                'location': {
                    'type': 'Point',
                    'coordinates': [driver.current_location[1], driver.current_location[0]]
                },
                'status': driver.status,
                'currentOrder': driver.current_order_id,
                'lastActive': driver.last_updated
            }}
        )
    
    def get_pending_orders(self) -> List[Dict[str, Any]]:
        """Get orders that need driver assignment"""
        collection = self.db.orders
        return list(collection.find({
            'status': {'$in': ['CONFIRMED', 'PREPARING']},
            'driverId': {'$exists': False}
        }))
    
    def get_assigned_orders(self) -> List[Dict[str, Any]]:
        """Get orders that are assigned to drivers"""
        collection = self.db.orders
        return list(collection.find({
            'status': {'$in': ['ASSIGNED', 'PICKED_UP', 'ON_THE_WAY']},
            'driverId': {'$exists': True}
        }))
    
    def assign_driver_to_order(self, order_id: str, driver_id: str):
        """Assign a driver to an order"""
        collection = self.db.orders
        collection.update_one(
            {'_id': order_id},
            {'$set': {
                'driverId': driver_id,
                'status': 'ASSIGNED',
                'assignedAt': pymongo.MongoClient()._datetime.utcnow()
            }}
        )
    
    def update_order_status(self, order_id: str, status: str, **updates):
        """Update order status and additional fields"""
        collection = self.db.orders
        update_data = {'status': status, **updates}
        
        # Set timestamp based on status
        if status == 'PICKED_UP':
            update_data['pickedUpAt'] = pymongo.MongoClient()._datetime.utcnow()
        elif status == 'DELIVERED':
            update_data['deliveredAt'] = pymongo.MongoClient()._datetime.utcnow()
        
        collection.update_one(
            {'_id': order_id},
            {'$set': update_data}
        )
    
    def update_driver_status(self, driver_id: str, status: str, order_id: Optional[str] = None):
        """Update driver status and current order"""
        collection = self.db.drivers
        update_data = {'status': status}
        if order_id:
            update_data['currentOrder'] = order_id
        
        collection.update_one(
            {'driverId': driver_id},
            {'$set': update_data}
        )
    
    def increment_driver_deliveries(self, driver_id: str):
        """Increment driver's total delivery count"""
        collection = self.db.drivers
        collection.update_one(
            {'driverId': driver_id},
            {'$inc': {'totalDeliveries': 1}}
        )