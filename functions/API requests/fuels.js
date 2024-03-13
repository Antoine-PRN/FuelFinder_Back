const { createFuelsData } = require('../../utils/methods');

async function fetchFuels(latitude, longitude) {
    try {
        const response = await fetch(`https://api.prix-carburants.2aaz.fr/stations/around/${latitude},${longitude}?opendata=v2`, {
            method: "GET",
            headers: {
                'accept': 'application/json',
                'Range': 'station=1-20'
            }
        });

        const response_brands = await fetch(`https://api.prix-carburants.2aaz.fr/stations/around/${latitude},${longitude}?brands=1,2,66,136,28,42,12,26,49,19`, {
            method: "GET",
            headers: {
                'accept': 'application/json',
                'Range': 'station=1-20'
            }
        });

        const fuelsData = await response.json();
        const fuelsWithBrandsData = await response_brands.json();
        return createFuelsData(fuelsData, fuelsWithBrandsData);

    } catch (error) {
        throw new Error('Une erreur s\'est produite lors de la récupération des données de carburants');
    }
}


module.exports = {
    fetchFuels
}