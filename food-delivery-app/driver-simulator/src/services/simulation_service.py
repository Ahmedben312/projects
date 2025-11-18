import random
from typing import List, Dict, Any, Optional
from src.models.driver import Driver
from src.models.order import Order
from src.services.mongo_service import MongoService
from src.services.location_service import LocationService

class SimulationService:
    def __init__(self, mongo_service: MongoService):
        self.mongo_service = mongo_service
        self.location_service = LocationService()
    
    def update_driver_locations(self, drivers: List[Driver]):
        """Update all driver locations and handle order assignments"""
        assigned_orders = self.mongo_service.get_assigned_orders()
        order_destinations = {}
        
        # Build destination map for assigned orders
        for order in assigned_orders:
            if order.get('driverId'):
                if order['status'] in ['ASSIGNED', 'PREPARING']:
                    # Driver should go to restaurant
                    order_destinations[order['driverId']] = (
                        order['restaurantId']['location']['coordinates'][1],
                        order['restaurantId']['location']['coordinates'][0]
                    )
                elif order['status'] in ['PICKED_UP', 'ON_THE_WAY']:
                    # Driver should go to delivery location
                    order_destinations[order['driverId']] = (
                        order['deliveryLocation']['coordinates'][1],
                        order['deliveryLocation']['coordinates'][0]
                    )
        
        # Update each driver
        for driver in drivers:
            destination = order_destinations.get(driver.driver_id)
            driver.move(destination)
            
            # Update driver in database
            self.mongo_service.update_driver_location(driver)
            
            # Check if driver reached destination
            if destination and self._has_reached_destination(driver, destination):
                self._handle_destination_reached(driver, destination)
    
    def assign_orders_to_drivers(self, drivers: List[Driver]):
        """Assign pending orders to available drivers"""
        pending_orders = self.mongo_service.get_pending_orders()
        available_drivers = [d for d in drivers if d.status == "AVAILABLE"]
        
        for order in pending_orders:
            if not available_drivers:
                break
            
            # Get restaurant location
            restaurant_location = (
                order['restaurantId']['location']['coordinates'][1],
                order['restaurantId']['location']['coordinates'][0]
            )
            
            # Find closest available driver
            closest_driver = self._find_closest_driver(available_drivers, restaurant_location)
            if closest_driver:
                # Assign order to driver
                closest_driver.status = "ASSIGNED"
                closest_driver.current_order_id = order['_id']
                
                self.mongo_service.assign_driver_to_order(order['_id'], closest_driver.driver_id)
                self.mongo_service.update_driver_status(closest_driver.driver_id, "ASSIGNED", order['_id'])
                
                available_drivers.remove(closest_driver)
                
                print(f"Assigned order {order['_id']} to driver {closest_driver.driver_id}")
    
    def _find_closest_driver(self, drivers: List[Driver], destination: tuple) -> Optional[Driver]:
        """Find the closest driver to the destination"""
        if not drivers:
            return None
        
        closest_driver = None
        min_distance = float('inf')
        
        for driver in drivers:
            distance = self.location_service.calculate_distance(
                driver.current_location, destination
            )
            if distance < min_distance:
                min_distance = distance
                closest_driver = driver
        
        return closest_driver if min_distance <= 5.0 else None  # Max 5km distance
    
    def _has_reached_destination(self, driver: Driver, destination: tuple) -> bool:
        """Check if driver has reached the destination"""
        distance = self.location_service.calculate_distance(
            driver.current_location, destination
        )
        return distance <= 0.1  # Within 100 meters
    
    def _handle_destination_reached(self, driver: Driver, destination: tuple):
        """Handle when a driver reaches their destination"""
        assigned_orders = self.mongo_service.get_assigned_orders()
        driver_orders = [o for o in assigned_orders if o.get('driverId') == driver.driver_id]
        
        if not driver_orders:
            return
        
        order = driver_orders[0]
        
        if order['status'] in ['ASSIGNED', 'PREPARING']:
            # Driver reached restaurant - mark as picked up
            self.mongo_service.update_order_status(order['_id'], 'PICKED_UP')
            driver.status = "BUSY"
            print(f"Driver {driver.driver_id} picked up order {order['_id']}")
            
        elif order['status'] in ['PICKED_UP', 'ON_THE_WAY']:
            # Driver reached delivery location - mark as delivered
            self.mongo_service.update_order_status(order['_id'], 'DELIVERED')
            driver.status = "AVAILABLE"
            driver.current_order_id = None
            driver.total_deliveries += 1
            
            self.mongo_service.increment_driver_deliveries(driver.driver_id)
            print(f"Driver {driver.driver_id} delivered order {order['_id']}")