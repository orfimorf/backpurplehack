const {json} = require('sequelize')
const ApiError = require('../errors/ApiError')
const {Baseline} = require('../models')

class BaselineController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const response = await Baseline.create({name})
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async get(req, res, next) {
        try {
            const {name} = req.query
            const response = await Baseline.findOne({where: {name}})
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const response = await Baseline.findAll()
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const {newName, oldName} = req.body
            const response = await Baseline.update({name: newName}, {where: {name: oldName}})
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new BaselineController()