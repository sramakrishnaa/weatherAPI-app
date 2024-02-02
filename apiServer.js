// Import required modules
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

// Create an Express application
const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Define a POST endpoint for getting weather information for cities
app.post('/getWeather', async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { cities } = req.body;
        const weatherResult = await getWeatherForCities(cities);

        res.json({ weather: weatherResult });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to get weather information for an array of cities
async function getWeatherForCities(cities) {
    const apiId = 'YOUR_WEATHER_API_KEY';
    const units = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?'; // OpenWeatherMap API credentials and endpoint details
    const weatherResult = {};

    // Use Promise.all to concurrently fetch weather information for all cities
    await Promise.all(
        cities.map(async (city) => {
            try {
                const response = await axios.get(`${url}q=${city}&appid=${apiId}&units=${units}`); // Make a request to the OpenWeatherMap API for each city

                weatherResult[city] = response.data.main.temp + "\u00B0C";
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    weatherResult[city] = 'City not found';
                } else {
                    throw error;
                }
            }
        })
    );
    return weatherResult;
}

// Start the Express server and listen on the specified port
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
