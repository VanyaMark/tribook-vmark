// Public routes of the application
const express = require('express');
const router = express.Router();

// Import all controllers from controllers/index.js
const indexControllers = require('../controllers/index.js');

// The router works similarly to "app" in Express, allowing us to define a set of routes
router.get('/', indexControllers.getApartments);

// Search apartments: Create a route for the /search endpoint that executes the searchApartments controller
router.get('/search', indexControllers.searchApartments);

// Dynamic route to get the details of a specific apartment by ID
router.get('/apartment/:idApartment', indexControllers.getApartmentById);

// Route for creating a new reservation for an apartment (via POST request)
router.post('/apartment/new-reservation', indexControllers.postNewReservation);

// Route to show a summary of a reservation
router.get('/apartment/reservation-summary', indexControllers.postNewReservation)

// Export these routes to be used in app.js
module.exports = router;