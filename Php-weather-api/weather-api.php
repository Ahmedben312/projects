<?php
$weather_data = null;
$error = null;

if(isset($_POST['get_weather'])) {
    $city = urlencode($_POST['city']);
    $api_key = "a5a3b52362171c7eb93a677600bd0bf1"; // Get free API key from OpenWeatherMap
    $url = "https://api.openweathermap.org/data/2.5/weather?q={$city}&appid={$api_key}&units=metric";
    
    $response = @file_get_contents($url);
    
    if($response !== false) {
        $weather_data = json_decode($response, true);
    } else {
        $error = "Could not fetch weather data. Please check the city name.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Weather App</title>
</head>
<body>
    <h2>Weather Checker</h2>
    <form method="post">
        <input type="text" name="city" placeholder="Enter city name" required>
        <button type="submit" name="get_weather">Get Weather</button>
    </form>

    <?php if($error): ?>
        <p style="color: red;"><?php echo $error; ?></p>
    <?php endif; ?>

    <?php if($weather_data && $weather_data['cod'] == 200): ?>
        <div style="margin-top: 20px; padding: 15px; border: 1px solid #ccc;">
            <h3>Weather in <?php echo $weather_data['name']; ?>, <?php echo $weather_data['sys']['country']; ?></h3>
            <p><strong>Temperature:</strong> <?php echo $weather_data['main']['temp']; ?>°C</p>
            <p><strong>Weather:</strong> <?php echo $weather_data['weather'][0]['description']; ?></p>
            <p><strong>Humidity:</strong> <?php echo $weather_data['main']['humidity']; ?>%</p>
            <p><strong>Wind Speed:</strong> <?php echo $weather_data['wind']['speed']; ?> m/s</p>
        </div>
    <?php elseif($weather_data && $weather_data['cod'] != 200): ?>
        <p style="color: red;">City not found. Please try again.</p>
    <?php endif; ?>
</body>
</html>