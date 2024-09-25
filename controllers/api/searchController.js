const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET route to render the search form
router.get('/search', (req, res) => {
    res.render('search');  // Renders the search form (search.handlebars)
});

// POST route to handle the form submission and make the API call
router.post('/search', async (req, res) => {
    const { latitude, longitude, startDate, endDate, radius } = req.body;

    // Construct the USGS API URL
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}`;

    try {
        // Fetch earthquake data
        const response = await axios.get(url);
        const earthquakeData = response.data.features;

        // Render the results page and pass the earthquake data to it
        res.render('search-results', { earthquakes: earthquakeData });
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        res.status(500).send('Error fetching earthquake data');
    }
});

module.exports = router;