    </main>

    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>Real Estate System</h5>
                    <p>Find your dream property with our advanced search and professional agents.</p>
                </div>
                <div class="col-md-4">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="properties.php" class="text-light">Properties</a></li>
                        <li><a href="agents.php" class="text-light">Agents</a></li>
                        <li><a href="about.php" class="text-light">About Us</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Contact Info</h5>
                    <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
                    <p><i class="fas fa-envelope"></i> info@realestate.com</p>
                </div>
            </div>
            <hr>
            <div class="text-center">
                <p>&copy; 2024 Real Estate System. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=<?php echo GOOGLE_MAPS_API_KEY; ?>&libraries=places"></script>
    
    <script>
        // Initialize Google Maps
        function initMap(lat, lng, propertyId) {
            const location = { lat: parseFloat(lat), lng: parseFloat(lng) };
            const map = new google.maps.Map(document.getElementById('map-' + propertyId), {
                zoom: 15,
                center: location,
            });
            
            new google.maps.Marker({
                position: location,
                map: map,
            });
        }

        // Favorite functionality
        function toggleFavorite(propertyId) {
            fetch('actions/toggle-favorite.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ property_id: propertyId })
            })
            .then(response => response.json())
            .then(data => {
                const heartIcon = document.querySelector(`[data-property="${propertyId}"] i`);
                if (data.status === 'added') {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas', 'text-danger');
                } else {
                    heartIcon.classList.remove('fas', 'text-danger');
                    heartIcon.classList.add('far');
                }
            });
        }

        // Image gallery lightbox
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'imageFadeDuration': 300
        });
    </script>
</body>
</html>