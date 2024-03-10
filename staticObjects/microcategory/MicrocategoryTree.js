const {mockMicrocategories} = require('../mocks/Microcategory')
const MicrocategoryNode = require('./MicrocategoryNode')

class MicrocategoryTree {
    static microcategories = mockMicrocategories
    static root = new MicrocategoryNode(1, "ROOT", null)
}

module.exports = MicrocategoryTree