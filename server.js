require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile); // Pass user profile to next middleware
}));


// Serialize user info to session
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
// OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 
'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', 
{ failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);
// Protected Route (Only for Authenticated Users)
app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.json({ message: "Welcome to Dashboard", user: req.user });
});
// Logout Route
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});
// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on 
http://localhost:${PORT}`
);


});
