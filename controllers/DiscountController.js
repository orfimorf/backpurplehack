const { json } = require('sequelize')
const ApiError = require('../errors/ApiError')
const {Discount, Baseline} = require('../models')

class DiscountController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const response = await Discount.create({name})
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async get(req, res, next) {
        try {
            const {name} = req.query
            const response = await Discount.findOne({where: {name}})
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const response = await Discount.findAll()
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const {newName, oldName} = req.body
            const response = await Discount.update({name: newName}, {where: {name: oldName}})
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new DiscountController()