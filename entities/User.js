const {microcategoryTree} = require('../staticObjects/microcategory/MicrocategoryTree')
const {locationTree} = require('../staticObjects/location/LocationTree')
const DiscountSegments = require('../staticObjects/discount/DiscountSegments')

class User {
    constructor(id, location_id, microcategory_id) {
        this._id = id
        this._location_id = location_id
        this._microcategory_id = microcategory_id
    }

    async findCost() {
        const segments = await DiscountSegments.getSegmentsByUserId(this._id)
        segments.forEach(segment => {
            const potCost = this._tryGetCostFromMatrix(
                this._microcategory_id, this._location_id, this._getMatrixBySegment(segment)
            )
            if (potCost) {
                return potCost
            }
        })
        return this._tryGetCostFromMatrix(this._microcategory_id, this._location_id, this._getBaselineMatrix())
    }

    async _getMatrixBySegment(segment) {

    }

    async _getBaselineMatrix() {

    }

    async _tryGetCostFromMatrix(microcategoryId, locationId, matrix) {
        let location = locationTree.getLocation(locationId)
        while (location.parent) {
            let microcategory = microcategoryTree.getMicrocategory(microcategoryId)
            while (microcategory.parent) {
                const potCost = this._tryGetCostFromMatrixByIds(
                    microcategory.id, location.id, matrix
                )
                if (potCost) {
                    return potCost
                }
                microcategory = microcategory.parent
            }
            location = location.parent
        }
        return null
    }

    async _tryGetCostFromMatrixByIds(microcategoryId, locationId, matrix) {

    }
}

module.exports = User