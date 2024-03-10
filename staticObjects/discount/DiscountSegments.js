const {mockSegments} = require('../mocks/DiscountMock')

class DiscountSegments {
    static segments = mockSegments

    static async getSegmentsByUserId(id) {
        let segment = this.segments[id]
        if (!segment) {
            return []
        }
        return segment
    }
}

module.exports = DiscountSegments