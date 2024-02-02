// Import required modules
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

// Create an Express application
const app = express();
const port = 4000;

// Middleware to parse incoming URL-encoded requests and serve static files from the "public" directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Define a route to render the index page with initial empty weather data
app.get('/', (req, res) => {
    res.render("index.ejs", { weather: { error: ' ' } });
});

// Define a route to handle form submission and fetch weather data from the API
app.post('/submit', async (req, res) => {
    try {

        const citiesInput = req.body.cities;

        if (!citiesInput.trim()) {          // Check if citiesInput is empty or contains only spaces
            return res.render("index.ejs", { weather: { error: 'Please enter at least one city.' } });
        }

        const cities = citiesInput.split(',').map(city => city.trim());  // Split the input into an array of cities and trim whitespace
        console.log("Cities:", cities);

        const weatherResults = await getWeatherFromApi(cities);

        res.render("index.ejs", { weather: weatherResults });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to fetch weather data from the API
async function getWeatherFromApi(cities) {
    const url = 'http://localhost:3000/getWeather'; // API endpoint for weather data
    const response = await axios.post(url, { cities });
    return response.data.weather;
}

// Start the Express server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
