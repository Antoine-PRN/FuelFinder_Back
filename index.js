const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { fetchCities } = require('./functions/API requests/api-gouv-communes'); // Importez la fonction depuis le fichier functions.js
const { loginUser } = require('./functions/authentication/login');
const { registerUser } = require('./functions/authentication/register');
const { UsernameDuplicates, InvalidInput } = require('./exceptions');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

const port = 5000;

app.post('/user/login', async (req, res) => {
  try {
    const user = await loginUser(req.body.username, req.body.password);
    if (user) {
      res.status(200).json({ message: 'Connection successful', user });
    }
  } catch (error) {
    if (error instanceof UsernameDuplicates) {
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

app.post('/user/register', async (req, res) => {
  try {
    const user = await registerUser(req.body.username, req.body.password, req.body.email);

    if (user) {
      res.status(201).json({ message: 'Account created successfully', user });
    } else {
      res.status(500).json({ error: 'User registration failed' });
    }
  } catch (error) {
    if (error instanceof UsernameDuplicates) {
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
