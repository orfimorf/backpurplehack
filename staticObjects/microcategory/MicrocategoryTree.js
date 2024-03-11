const MicrocategoryMock = require('../mocks/MicrocategoryMock')
const MicrocategoryNode = require('./MicrocategoryNode')

class MicrocategoryTree {
    constructor() {
        this._microcategories = MicrocategoryMock.mockMicrocategories
        this._root = new MicrocategoryNode(1, "ROOT", null)
        this._index = 2
        this._indexes = []
        this._indexes[1] = this._root
        this._initialize()
    }

    _initialize() {
        for (let key in this._microcategories) {
            let child = new MicrocategoryNode(this._index, key, this._root)
            this._indexes[child.id] = child
            this._index++
            this._root.setChild(child)
            this._microcategories[key].forEach(value => {
                let node = this._returnSubTree(child, value)
                if (!node) {
                    return
                }
                child.setChild(node)
            })
        }
    }

    _returnSubTree(root, microcategories) {
        if (typeof microcategories == "string") {
            let node = new MicrocategoryNode(this._index, microcategories, root)
            this._indexes[node.id] = node
            this._index++
            return node
        }

        for (let key in microcategories) {
            let node = new MicrocategoryNode(this._index, key, root)
            this._indexes[node.id] = node
            this._index++
            root.setChild(node)
            microcategories[key].forEach(value => {
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

module.exports = MicrocategoryTree