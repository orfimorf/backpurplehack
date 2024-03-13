const LocationMock = require('../mocks/LocationMock')
const LocationNode = require('./LocationNode')

class LocationTree {
    constructor() {
        this._locations = LocationMock.mockLocations
        this._root = new LocationNode(1, "ROOT", null)
        this._index = 2
        this._indexes = []
        this._locationsNamesInArray = []
        this._indexes[1] = this._root
        this._namesAndIndexes = {}
        this._initialize()
    }

    getLocation(id) {
        return this._indexes[id]
    }

    getIdByName(name) {
        return this._namesAndIndexes[name]
    }

    getNameById(id) {
        return this.getLocation(id).name
    }

    getSubLocations(name) {
        let subLocations = []
        const rootId = this.getIdByName(name)
        const root = this.getLocation(rootId)
        subLocations.push(root.id)
        root.children.forEach(child => {
            this._getSubLocationsFromNode(child, subLocations)
        })
        return subLocations
    }

    _getSubLocationsFromNode(root, subLocations) {
        subLocations.push(root.id)
        root.children.forEach(child => {
            this._getSubLocationsFromNode(child, subLocations)
        })
    }

    get locationsNamesInArray() {
        return this._locationsNamesInArray
    }

    _initialize() {
        for (let key in this._locations) {
            let child = new LocationNode(this._index, key, this._root)
            this._indexes[child.id] = child
            this._namesAndIndexes[child.name] = child.id
            this._index++
            this._root.setChild(child)
            this._locations[key].forEach(value => {
                let node = this._returnSubTree(child, value)
                if (!node) {
                    return
                }
                child.setChild(node)
            })
        }

        this._indexes.forEach(location => {
            this._locationsNamesInArray.push(location.name)
        })
    }

    _returnSubTree(root, locations) {
        if (typeof locations == "string") {
            let node = new LocationNode(this._index, locations, root)
            this._indexes[node.id] = node
            this._namesAndIndexes[node.name] = node.id
            this._index++
            return node
        }

        for (let key in locations) {
            let node = new LocationNode(this._index, key, root)
            this._indexes[node.id] = node
            this._namesAndIndexes[node.name] = node.id
            this._index++
            root.setChild(node)
            locations[key].forEach(value => {
                let child = this._returnSubTree(node, value)
                if (!child) {
                    return
                }
                node.setChild(child)
            })
        }
        return null
    }
}

module.exports = new LocationTree()