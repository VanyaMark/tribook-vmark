// Import third-party modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

// Import public routes
const indexRoutes = require('./routes/index.js');

// Import admin routes
const adminRoutes = require('./routes/admin.js');

// Import authentication routes
const authRoutes = require('./routes/auth.js');

// Create an instance of the Express server
const app = express();

// Middleware to parse URL-encoded bodies (necessary for processing POST requests)
app.use(express.urlencoded({ extended: true }));

// Configure session management
app.use(session({
    secret: 'miSecretoSuperSecreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true in production with HTTPS
}));

// Middleware to make req.session.isAuthenticated available to all views and backend routes
app.use((req, res, next) => {
    // req.session.isAuthenticated indicates if the user is authenticated
    res.locals.isAdmin = req.session.isAuthenticated;

    // Proceed to the next middleware or route handler
    next();
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve static files from node_modules (for Vanilla Calendar)
app.use('/static', express.static(path.join(__dirname, 'node_modules')));

const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Use Morgan for logging client requests
app.use(morgan('tiny'));

// Add routes from index.js to the app
// All routes in 'indexRoutes' will be prefixed with '/'
// Admin routes will be prefixed with '/admin'

// Middleware to protect admin routes
app.use('/admin', (req, res, next) => {
    // Check if the user is authenticated
    if (req.session.isAuthenticated) {
        // If authenticated, set res.locals.isAdmin to true and proceed
        res.locals.isAdmin = true;
        next();
    } else {
        // If not authenticated, redirect to the login page
        res.redirect('/login');
    }
});

app.use('/admin', adminRoutes);
app.use('/', authRoutes);
app.use('/', indexRoutes);

// Connect to the MongoDB database
async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to the database');
}



connectDB().catch(err => console.log(err))

app.listen(PORT, (req, res) => {
    console.log("Servidor escuchando correctamente en el puerto " + PORT);
});
