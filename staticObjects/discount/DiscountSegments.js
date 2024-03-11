const SegmentsMock = require('../mocks/SegmentsMock')

class DiscountSegments {
    static segments = SegmentsMock.mockSegments

    static async getSegmentsByUserId(id) {
        let segment = this.segments[id]
        if (!segment) {
            return []
        }
        return segment
    }
}

module.exports = DiscountSegments