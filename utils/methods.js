function createFuelsData(fuelsData, fuelsWithBrandsData) {
    for (let i = 0; i < fuelsWithBrandsData.length; i++) {
        brandData = {
            "Brand": fuelsWithBrandsData[i].Brand,
            "Distance": fuelsWithBrandsData[i].Distance,
        };
        fuelsData[i] = Object.assign(fuelsData[i], brandData);
    }
    return fuelsData;
}


module.exports = {
    createFuelsData
}