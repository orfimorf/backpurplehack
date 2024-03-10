class MicrocategoryNode {
    constructor(id, name, parent) {
        this._id = id
        this._name = name
        this._parent = parent
        this._children = []
    }

    get id() {
        return this._id
    }

    get name() {
        return this._name
    }

    get parent() {
        return this._parent
    }

    get children() {
        return this._children
    }

    getChild(id) {
        return this._children[id]
    }

    setChild(microcategoryNode) {
        this._children.push(microcategoryNode)
    }
}

module.exports = MicrocategoryNode