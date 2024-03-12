const {json, DataTypes} = require('sequelize')
const ApiError = require('../errors/ApiError')
const {Baseline} = require('../models')
const db = require('../db')


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

    async updateAll(req, res, next) {
        const t = await db.transaction()
        try {
            const {name, updates} = req.body

            const newMatrixName = `baseline_${new Date().toLocaleString()}`

            await Baseline.create({name: newMatrixName},
                {transaction: t})

            await db.query("CREATE TABLE \"" + newMatrixName.toString() + "\" AS SELECT id, microcategory_id, location_id, price FROM \"" + name.toString() + "\";",
                {transaction: t})

            await t.commit()

            updates.forEach(r => {
                db.query("UPDATE \"" + newMatrixName.toString() + "\" SET price=price*" + r.percent.toString() + " WHERE id=" + r.id.toString() + ";")
            })


            return res.json(200)
        } catch (e) {
            await t.rollback()
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        const t = await db.transaction()
        try {
            const {name, updates} = req.body
            const newMatrixName = `baseline_${new Date().toLocaleString()}`

            await Baseline.create({name: newMatrixName},
                {transaction: t})

            await db.query("CREATE TABLE \"" + newMatrixName.toString() + "\" AS SELECT id, microcategory_id, location_id, price FROM \"" + name.toString() + "\";",
                {transaction: t})

            await t.commit()

            updates.forEach(r => {
                db.query("UPDATE \"" + newMatrixName.toString() + "\" SET price=" + r.price.toString() + " WHERE id=" + r.id.toString() + ";")
            })


            return res.json(200)
        } catch (e) {
            await t.rollback()
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new BaselineController()