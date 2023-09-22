const axios = require('axios');

async function fetchCities () {
  try {
    const response = await axios.get('https://geo.api.gouv.fr/communes');

    const cities = [...new Set(response.data.map(city => city.nom))];
    return cities
  } catch (error) {
    throw new Error('Une erreur s\'est produite lors de la récupération des données');
  }
}

module.exports = {
  fetchCities
}