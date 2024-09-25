const express = require('express');
const router = express.Router();
const { format_date, json } = require('../utils/helpers');

router.get('/test-helpers', (req, res) => {
  const testDate = new Date();  // Example date for testing
  const testObject = { name: "Earthquake", magnitude: 5.0 };  // Example object for JSON conversion

  res.render('test-helpers', {
    formattedDate: format_date(testDate),
    jsonObject: json(testObject),
  });
});

module.exports = router;