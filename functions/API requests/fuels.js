const { createFuelsData } = require('../../utils/methods');

async function fetchFuels(latitude, longitude) {
    const fuelsData = [];
    const fuelsWithBrandsData = [];

    try {
        const response = await apiCalls(latitude, longitude);

        fuelsData.push(...response.fuelsData);
        fuelsWithBrandsData.push(...response.fuelsWithBrandsData);

        // Station avec la latitude la plus grande
        const maxLatObject = fuelsData.reduce((prev, curr) => curr.geom.lat > prev.geom.lat ? curr : prev);
        const maxLatResponse = await apiCalls(maxLatObject.geom.lat, maxLatObject.geom.lon);
        fuelsData.push(...maxLatResponse.fuelsData);
        fuelsWithBrandsData.push(...maxLatResponse.fuelsWithBrandsData);

        // Station avec la latitude la plus petite
        const minLatObject = fuelsData.reduce((prev, curr) => curr.geom.lat < prev.geom.lat ? curr : prev);
        const minLatResponse = await apiCalls(minLatObject.geom.lat, minLatObject.geom.lon);
        fuelsData.push(...minLatResponse.fuelsData);
        fuelsWithBrandsData.push(...minLatResponse.fuelsWithBrandsData);

        const maxLonObject = fuelsData.reduce((prev, curr) => curr.geom.lon > prev.geom.lon ? curr : prev);
        const maxLonResponse = await apiCalls(maxLonObject.geom.lat, maxLonObject.geom.lon);
        fuelsData.push(...maxLonResponse.fuelsData);
        fuelsWithBrandsData.push(...maxLonResponse.fuelsWithBrandsData);

        const minLonObject = fuelsData.reduce((prev, curr) => curr.geom.lon < prev.geom.lon ? curr : prev);
        const minLonResponse = await apiCalls(minLonObject.geom.lat, minLonObject.geom.lon);
        fuelsData.push(...minLonResponse.fuelsData);
        fuelsWithBrandsData.push(...minLonResponse.fuelsWithBrandsData);

        return createFuelsData(fuelsData, fuelsWithBrandsData);

    } catch (error) {
        throw new Error('Une erreur s\'est produite lors de la récupération des données de carburants');
    }
}

async function apiCalls(latitude, longitude) {
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
    return {
        'fuelsData': fuelsData,
        'fuelsWithBrandsData': fuelsWithBrandsData
    }
}


module.exports = {
    fetchFuels
}