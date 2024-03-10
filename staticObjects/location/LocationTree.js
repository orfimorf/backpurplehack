const {mockLocations} = require('../mocks/LocationMock')
const LocationNode = require('./LocationNode')

class LocationTree {
    static locations = mockLocations
    static root = new LocationNode(1, "Все регионы", null)
}

module.exports = LocationTree