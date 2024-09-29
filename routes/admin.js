// Admin routes for managing apartments
const express = require('express');
const router = express.Router();

// Import all controllers from controllers/admin.js
const adminControllers = require('../controllers/admin.js');

// Route to display the form for adding a new apartment (GET request)
router.get('/apartment/new-apartment', adminControllers.getNewApartmentForm);

// Route to handle the form submission for adding a new apartment (POST request)
router.post('/apartment/new-apartment', adminControllers.postNewApartment);

// Dynamic route to display the form for editing an existing apartment (GET request)
router.get('/apartment/:idApartment/edit', adminControllers.getApartmentByIdEdit);

// Route to handle the form submission for editing a specific apartment (POST request)
router.post('/apartment/:idApartment/edit', adminControllers.postApartmentByIdEdit);

// Route to unpublish an apartment (POST request)
router.post('/apartment/:idApartment/unpublish', adminControllers.postUnpublishApartment)

// Route to publish an apartment (POST request)
router.post('/apartment/:idApartment/publish', adminControllers.postPublishApartment)

module.exports = router;