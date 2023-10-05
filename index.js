const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { fetchCities } = require('./functions/API requests/api-gouv-communes');
const { loginUser } = require('./functions/authentication/login');
const { registerUser, registerGoogleUser } = require('./functions/authentication/register');
const { EmailDuplicates, InvalidInput, UserNotFound } = require('./exceptions');
const { getRefreshToken } = require('./utils/jwt');
const { getUser } = require('./functions/user');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

const port = 5000;

// Google connection
// Configurez la session pour stocker les informations d'authentification
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
},
  (accessToken, refreshToken, profile, done) => {
    // Ici, vous pouvez gérer les informations du profil utilisateur
    return done(null, profile);
  }));

// Serialize/deserialize l'utilisateur pour stocker dans la session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Point de terminaison pour l'authentification OAuth2
app.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
);

// Point de terminaison de rappel OAuth2
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/google/data');
  }
);

// Point de terminaison de déconnexion
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Vous pouvez maintenant protéger vos routes avec `ensureAuthenticated`
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
}

// Exemple de route protégée par l'authentification
app.get('/google/data', ensureAuthenticated, async (req, res) => {
  
  try {
    const user = await registerGoogleUser(req.user);

    if (user) {
      res.status(201).json({ message: 'Account connected successfully', user });
    } else {
      res.status(500).json({ message: 'Account connection failed' });
    }
  } catch (error) {
    if (error instanceof EmailDuplicates) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// ***** //

app.post('/user/login', async (req, res) => {
  try {
    const user = await loginUser(req.body.email, req.body.password, req.body.stayLoggedIn);
    if (user) {
      res.status(200).json({ message: 'Connection successful', token: user.token, refreshToken: user.refresh_token });
    }
  } catch (error) {
    if (error instanceof EmailDuplicates) {
      res.status(409).json({ error: error.message });
    }
    if (error instanceof InvalidInput) {
      res.status(400).json({ error: error.message });
    }
    if (error instanceof UserNotFound) {
      res.status(404).json({ error: error.message });
    }
    else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/user/register', async (req, res) => {
  try {
    const user = await registerUser(req.body.password, req.body.email, req.body.firstname, req.body.lastname);

    if (user) {
      res.status(201).json({ message: 'Account created successfully', user });
    } else {
      res.status(500).json({ error: 'User registration failed' });
    }
  } catch (error) {
    if (error instanceof EmailDuplicates) {
      res.status(409).json({ error: error.message });
    }
    if (error instanceof InvalidInput) {
      res.status(400).json({ error: error.message });
    }
    else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/user/refresh_token', async (req, res) => {
  try {
    const token = getRefreshToken(req.body.refreshToken);
    console.log(req.body)
    if (token) {
      res.status(200).json({ token: token });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/user/get_user', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = await getUser(token)

    if (user) {
      res.status(200).json({ user: user });
    }
  } catch (error) {
    if (error instanceof UserNotFound) {
      res.status(404).json({ message: error.message });
    }
    res.status(500).json({ error: error.message });
  }
})

// Route /cities qui utilise la fonction fetchCities
app.get('/cities', async (req, res) => {
  try {
    const citiesData = await fetchCities(); // Utilisez la fonction importée
    res.json(citiesData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});
