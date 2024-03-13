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
const { EmailDuplicates, InvalidInput, UserNotFound, InvalidEmail, InvalidPassword } = require('./exceptions');
const { getRefreshToken } = require('./utils/jwt');
const { getUser } = require('./functions/user');
const { updateEmail, updatePassword } = require('./functions/user/updates');
const { fetchFuels } = require('./functions/API requests/fuels');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16'
});

// AUTHENTICATION
app.post('rest/user/login', async (req, res) => {
  try {
    const user = await loginUser(req.body.email, req.body.password);
    if (user) {
      res.status(200).json({ message: 'Connection successful', token: user.token, refreshToken: user.refresh_token, premium: user.premium });
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

app.post('rest/user/register', async (req, res) => {
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
    } else if (error instanceof InvalidInput || error instanceof InvalidEmail) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }

});

// USERS
app.post('rest/user/update_email', async (req, res) => {
  try {
    const token = req.headers.authorization;
    user = updateEmail(token, req.body.newEmail, req.body.previousEmail);
    if (user) {
      res.status(200).json({ message: 'Email update successfully', user });
    } else {
      res.status(500).json({ error: 'Email update failed' });
    }
  } catch (error) {
    console.log(error instanceof EmailDuplicates)
    if (error instanceof EmailDuplicates) {
      res.status(409).json({ error: error.message });
    } if (error instanceof InvalidEmail) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('rest/user/update_password', async (req, res) => {
  try {
    const token = req.headers.authorization;
    user = updatePassword(token, req.body.oldPassword, req.body.newPassword, req.body.newPassword2);
  } catch (error) {
    if (error instanceof UserNotFound) {
      res.status(404).json({ error: error.message });
    }
    if (error instanceof InvalidPassword) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('rest/user/refresh_token', async (req, res) => {
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

app.get('rest/user/get_user', async (req, res) => {
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

// GOOGLE AUTHENTICATION
app.post('/google/register', async (req, res) => {
  try {
    const user = await registerGoogleUser(req.body.user);
    if (user) {
      res.status(201).json({ message: 'Account registered successfully', token: user.token })
    } else {
      res.status(500).json({ error: 'User registration failed' });
    }
  } catch (error) {
    if (error instanceof EmailDuplicates) {
      res.status(409).json({ error: error.message });
    }
    else {
      res.status(500).json({ error: error.message });
    }
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

// Stripe 
app.get('/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  })
});

app.get('/rest/fuels', async (req, res) => {
  try {
    const latitude = req.headers.latitude;
    const longitude = req.headers.longitude;
    const fuels = await fetchFuels(latitude, longitude);
    res.status(200).json({ fuels: fuels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'eur',
      amount: 399,
      automatic_payment_methods: {
        enabled: true,
      }
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});



app.listen(process.env.PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${process.env.PORT}`);
});
