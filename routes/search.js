const express = require('express');
const router = express.Router();
const { Searches } = require('../models'); // Import your model if needed

// GET: Display search page or search results
router.get('/', async (req, res) => {
  try {
    // If you want to render the search page first (with no data initially)
    res.render('search-results', {
      title: 'Search Results',
      earthquakes: [], // Empty initially
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading search page', error: err });
  }
});

// POST: Handle search query and return results (if needed)
router.post('/', async (req, res) => {
  try {
    const { searchTerm } = req.body; // Assuming you have a search term or criteria

    // Example of querying a database or API based on search term
    // Replace with your actual search logic
    const results = await Searches.findAll({
      where: {
        // Example search criteria - adjust to your needs
        name: {
          [Op.like]: `%${searchTerm}%`, // Replace 'name' with relevant search field
        },
      },
    });

    // Render the search-results view with the results
    res.render('search-results', {
      title: 'Search Results',
      earthquakes: results, // Pass the search results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing search', error: err });
  }
});

module.exports = router;