const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');

// SIGNUP
// Render the signup form
const getSignup = (req, res) => {
    res.render('signup');
};

// Check if the email already exists in the database
const checkIfEmailExists = async (email) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already exists');
            return true; // Email exists
        } else {
            console.log('Email is available');
            return false; // Email does not exist
        }
    } catch (err) {
        console.error('Error checking email existence:', err);
        throw err; // Rethrow the error if needed
    }
};

// Handle user signup
const postSignup = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email already exists
        const emailExists = await checkIfEmailExists(email);
        if (emailExists) {

            req.flash(
                "error",
                "Este email ya existe."
              );
            return res.redirect('/signup');
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            email,
            password: hashedPassword,  // Use hashed password
            isAdmin: true // You can change this based on your app logic
        });

        await newUser.save();
        
        req.flash("success", "Usuario creado con éxito");
        return res.redirect('/login');
    } catch (err) {
        console.error('Error during signup:', err); // Log the error for debugging
        return res.status(500).json({ error: 'Server error during registration' });
    }
};

// LOGIN
// Render the login form
const getLoginForm = (req, res) => {
    return res.render('login');
};

// Handle user login
const postLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const authenticatedUser = await User.findOne({ email });

        if (!authenticatedUser) {
            // If no user found, return an error
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, authenticatedUser.password);

        if (!isMatch) {
            // If password does not match, return an error
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // If authentication is successful, create a session for the user
        req.session.isAuthenticated = true;
        res.locals.isAdmin = true;

        // Redirect the user after successful login
        return res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Server error during login.' });
    }
};

// LOGOUT
// Handle user logout
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out');
        }
        // Redirect to homepage after logout
        return res.redirect('/');
    });
};

module.exports = {
    getSignup,
    postSignup,
    getLoginForm,
    postLoginForm,
    logout
};
