const {microcategoryTree} = require('./staticObjects/microcategory/MicrocategoryTree')
const {locationTree} = require('./staticObjects/location/LocationTree')
const SegmentsMock = require('./staticObjects/mocks/SegmentsMock')

class ServerConfiguration {
    constructor() {
        this._baseline = {}
        this._disounts = []
        this._unusedSegments = []
        this._userSegments = []
        this._initializeServer()
    }

    get baseline() {
        return this._baseline
    }

    get discounts() {
        return this._disounts
    }

    get unusedSegments() {
        return this._unusedSegments
    }

    get userSegments() {
        return this._userSegments
    }

    _initializeServer() {
        const baseline = this._getBaselineMatrix()
        const discounts = this._getDiscountMatrices()
        const userSegments = this._getUserSegments()

        const segments = []
        Object.keys(userSegments).forEach(key => {
            segments.push(...userSegments[key])
        })

        const usedSegments = discounts.map(discount => {
            return discount["segment"]
        })

        const unusedSegments = segments.filter(segment => usedSegments.indexOf(segment) === -1)

        this._baseline = baseline
        this._disounts = discounts
        this._unusedSegments = unusedSegments
        this._userSegments = userSegments
    }

    _getUserSegments() {
        return SegmentsMock.mockSegments
    }

    _getBaselineMatrix() {
        return [
            {
                "id": 1,
                "name": "baseline_1",
                "active": false
            },
            {
                "id": 2,
                "name": "baseline_2",
                "active": true
            }
        ]
    }

    _getDiscountMatrices() {
        return [
            {
                "id": 1,
                "name": "discount_1",
                "active": false,
                "segment": null
            },
            {
                "id": 2,
                "name": "discount_2",
                "active": true,
                "segment": 213213
            }
        ]
    }
}

module.exports = new ServerConfiguration()