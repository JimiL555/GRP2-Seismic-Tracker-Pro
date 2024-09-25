const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Searches } = require('../models'); // Assuming this is your model for saved searches

// GET: Display search page or search results
router.get('/', async (req, res) => {
  try {
    // Render the search page with no data initially
    res.render('search-results', {
      title: 'Search Results',
      earthquakes: [], // Empty array initially
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading search page', error: err });
  }
});

// POST: Handle search query and return earthquake results
router.post('/', async (req, res) => {
  try {
    const { latitude, longitude, minMagnitude, maxMagnitude, startDate, endDate } = req.body;

    // Construct search criteria based on earthquake data
    const searchCriteria = {
      latitude: {
        [Op.between]: [latitude - 1, latitude + 1], // Allow a range of latitudes around the given point
      },
      longitude: {
        [Op.between]: [longitude - 1, longitude + 1], // Allow a range of longitudes around the given point
      },
      magnitude: {
        [Op.between]: [minMagnitude, maxMagnitude], // Filter earthquakes by magnitude
      },
      time: {
        [Op.between]: [new Date(startDate), new Date(endDate)], // Filter by date range
      }
    };

    // Query the database for earthquake results that match the criteria
    const results = await Searches.findAll({
      where: searchCriteria,
    });

    // Render the search-results view with the fetched earthquake data
    res.render('search-results', {
      title: 'Search Results',
      earthquakes: results, // Pass the earthquake data to the front-end template
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing search', error: err });
  }
});

module.exports = router;