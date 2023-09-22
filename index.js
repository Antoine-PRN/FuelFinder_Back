const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { fetchCities } = require('./functions'); // Importez la fonction depuis le fichier functions.js

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

const port = 5000;

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
