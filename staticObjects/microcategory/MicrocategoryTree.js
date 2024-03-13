const MicrocategoryMock = require('../mocks/MicrocategoryMock')
const MicrocategoryNode = require('./MicrocategoryNode')

class MicrocategoryTree {
    constructor() {
        this._microcategories = MicrocategoryMock.mockMicrocategories
        this._root = new MicrocategoryNode(1, "ROOT", null)
        this._index = 2
        this._indexes = []
        this._microcategoriesNamesInArray = []
        this._indexes[1] = this._root
        this._namesAndIndexes = {}
        this._initialize()
    }

    getMicrocategory(id) {
        return this._indexes[id]
    }

    getIdByName(name) {
        return this._namesAndIndexes[name]
    }

    getNameById(id) {
        return this.getMicrocategory(id).name
    }

    getSubCategories(name) {
        let subCategories = []
        const rootId = this.getIdByName(name)
        const root = this.getMicrocategory(rootId)
        subCategories.push(root.id)
        root.children.forEach(child => {
            this._getSubCategoriesFromNode(child, subCategories)
        })
        return subCategories
    }

    _getSubCategoriesFromNode(root, subCategories) {
        subCategories.push(root.id)
        root.children.forEach(child => {
            this._getSubCategoriesFromNode(child, subCategories)
        })
    }

    get microcategoriesNamesInArray() {
        return this._microcategoriesNamesInArray
    }

    _initialize() {
        for (let key in this._microcategories) {
            let child = new MicrocategoryNode(this._index, key, this._root)
            this._indexes[child.id] = child
            this._namesAndIndexes[child.name] = child.id
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

        this._indexes.forEach(microcategory => {
            this._microcategoriesNamesInArray.push(microcategory.name)
        })
    }

    _returnSubTree(root, microcategories) {
        if (typeof microcategories == "string") {
            let node = new MicrocategoryNode(this._index, microcategories, root)
            this._indexes[node.id] = node
            this._namesAndIndexes[node.name] = node.id
            this._index++
            return node
        }

        for (let key in microcategories) {
            let node = new MicrocategoryNode(this._index, key, root)
            this._indexes[node.id] = node
            this._namesAndIndexes[node.name] = node.id
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

module.exports = new MicrocategoryTree()