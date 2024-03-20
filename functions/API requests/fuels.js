const axios = require('axios');
const { createFuelsData } = require('../../utils/methods');

async function fetchFuels(latitude, longitude) {
    const fuelsData = [];
    const fuelsWithBrandsData = [];

    try {
        const response = await apiCalls(latitude, longitude);
        fuelsData.push(...response.fuelsData);
        fuelsWithBrandsData.push(...response.fuelsWithBrandsData);

        const directions = ['lat', 'lon'];

        const maxObject = fuelsData.reduce((prev, curr) => curr.geom["lat"] > prev.geom["lat"] ? curr : prev);
        const maxResponse = await apiCalls(maxObject.geom.lat, maxObject.geom.lon);
        fuelsData.push(...maxResponse.fuelsData);
        fuelsWithBrandsData.push(...maxResponse.fuelsWithBrandsData);

        const minObject = fuelsData.reduce((prev, curr) => curr.geom["lat"] < prev.geom["lat"] ? curr : prev);
        const minResponse = await apiCalls(minObject.geom.lat, minObject.geom.lon);
        fuelsData.push(...minResponse.fuelsData);
        fuelsWithBrandsData.push(...minResponse.fuelsWithBrandsData);


        return createFuelsData(fuelsData, fuelsWithBrandsData);

    } catch (error) {
        console.log(error);
        throw new Error('Une erreur s\'est produite lors de la récupération des données de carburants');
    }
}

async function apiCalls(latitude, longitude) {
    try {
        const response = await axios.get(`https://api.prix-carburants.2aaz.fr/stations/around/47.2150048,5.1718833?opendata=v2`);

        const responseBrands = await axios.get(`https://api.prix-carburants.2aaz.fr/stations/around/47.2150048,5.1718833?brands=1,2,66,136,28,42,12,26,49,19`);

        // console.log(`https://api.prix-carburants.2aaz.fr/stations/around/${latitude},${longitude}`)
        const fuelsData = response.data;
        const fuelsWithBrandsData = responseBrands.data;

        return {
            fuelsData,
            fuelsWithBrandsData
        };
    } catch (error) {
        console.log(error);
        throw new Error('Erreur lors de la récupération des données:', error);
    }
}

module.exports = {
    fetchFuels
};
