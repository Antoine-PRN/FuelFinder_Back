function createFuelsData(fuelsData, fuelsWithBrandsData) {
    fuelsWithBrandsData.forEach((brandData, i) => {
        fuelsData[i] = {
            ...fuelsData[i],
            Brand: brandData.Brand,
            Distance: brandData.Distance
        };
    });
    return fuelsData;
}

module.exports = {
    createFuelsData
}
