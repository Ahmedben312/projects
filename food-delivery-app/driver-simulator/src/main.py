import time
import signal
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from src.utils.config import Config
from src.services.mongo_service import MongoService
from src.services.simulation_service import SimulationService
from src.utils.helpers import generate_driver_id, random_location
from src.models.driver import Driver

class DriverSimulator:
    def __init__(self):
        self.config = Config()
        self.mongo_service = MongoService(self.config.mongo_uri)
        self.simulation_service = SimulationService(self.mongo_service)
        self.drivers = []
        self.is_running = False
        
    def initialize_drivers(self):
        """Initialize drivers for both cities"""
        print("🚗 Initializing drivers...")
        
        driver_index = 1
        for city_name, city_info in self.config.cities.items():
            center = city_info['center']
            radius = city_info['radius']
            
            for i in range(self.config.drivers_per_city):
                driver_id = generate_driver_id(city_name, driver_index)
                base_location = random_location(center, radius)
                
                driver = Driver(
                    driver_id=driver_id,
                    city=city_name,
                    base_location=base_location,
                    status="AVAILABLE"
                )
                self.drivers.append(driver)
                driver_index += 1
        
        # Save initial drivers to database
        self.mongo_service.initialize_drivers(self.drivers)
        print(f"✅ Initialized {len(self.drivers)} drivers ({self.config.drivers_per_city} in Sfax, {self.config.drivers_per_city} in NYC)")
        
    def run_simulation(self):
        """Main simulation loop"""
        print("🏁 Starting driver simulation...")
        self.is_running = True
        
        try:
            while self.is_running:
                # Update driver locations and handle orders
                self.simulation_service.update_driver_locations(self.drivers)
                
                # Assign new orders to available drivers
                self.simulation_service.assign_orders_to_drivers(self.drivers)
                
                # Wait for next update
                time.sleep(self.config.simulation_update_interval)
                
        except Exception as e:
            print(f"❌ Error in simulation loop: {e}")
            self.is_running = False
            
    def shutdown(self):
        """Gracefully shutdown the simulation"""
        print("🛑 Shutting down driver simulation...")
        self.is_running = False
        
        # Update all drivers to offline status
        for driver in self.drivers:
            driver.status = "OFFLINE"
            driver.is_active = False
            self.mongo_service.update_driver_location(driver)
        
        print("✅ Driver simulation stopped")

def signal_handler(simulator):
    """Handle shutdown signals - Windows compatible"""
    def handler(signum, frame):
        print(f"\nReceived shutdown signal, shutting down...")
        simulator.shutdown()
        sys.exit(0)
    return handler

def main():
    simulator = DriverSimulator()
    
    # Setup signal handlers for graceful shutdown (Windows compatible)
    if os.name == 'nt':  # Windows
        # Use a different approach for Windows
        print("Running on Windows - use Ctrl+C to stop")
    else:
        # Unix signal handling
        signal.signal(signal.SIGINT, signal_handler(simulator))
        signal.signal(signal.SIGTERM, signal_handler(simulator))
    
    try:
        # Initialize drivers
        simulator.initialize_drivers()
        
        # Start simulation
        simulator.run_simulation()
        
    except KeyboardInterrupt:
        print("\nReceived Ctrl+C, shutting down...")
        simulator.shutdown()
    except Exception as e:
        print(f"Fatal error: {e}")
        simulator.shutdown()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nSimulation stopped by user")