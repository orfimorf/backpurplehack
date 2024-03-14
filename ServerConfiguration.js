const microcategoryTree = require('./staticObjects/microcategory/MicrocategoryTree')
const locationTree = require('./staticObjects/location/LocationTree')
const SegmentsMock = require('./staticObjects/mocks/SegmentsMock')
const {Baseline, Discount} = require("./models");

class ServerConfiguration {
    constructor() {
        this._baseline = {}
        this._disounts = []
        this._unusedSegments = []
        this._userSegments = []
        this._microcategoryTree = microcategoryTree
        this._locationTree = locationTree
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

    get microcategoryTree() {
        return this._microcategoryTree
    }

    get locationTree() {
        return this._locationTree
    }

    async _initializeServer() {
        const baseline = await this._getBaselineMatrix()
        const discounts = await this._getDiscountMatrices()
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

    async reInitializeServer() {
        await this._initializeServer()
    }

    _getUserSegments() {
        return SegmentsMock.mockSegments
    }

    async _getBaselineMatrix(matrixController) {
        return await Baseline.findOne({where: {active: true}})
    }

    async _getDiscountMatrices(matrixController) {
        return await Discount.findAll({where: {active: true}})
    }
}

module.exports = new ServerConfiguration()