// Authentication routes for the application
const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/auth');

// Route to display the login form (GET request)
router.get('/login', authControllers.getLoginForm);

// Route to handle login form submission (POST request)
router.post('/login', authControllers.postLoginForm);

// Route to log the user out
router.get('/logout', authControllers.logout);

// Route to display the signup form (GET request)
router.get('/signup', authControllers.getSignup);

// Route to handle signup form submission (POST request)
router.post('/signup', authControllers.postSignup);

module.exports = router;