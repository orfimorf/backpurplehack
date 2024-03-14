const ApiError = require('../errors/ApiError')
const {Baseline, Discount} = require('../models')
const sequelize = require('../db')
const serverConfiguration = require('../ServerConfiguration')
const axios = require('axios')

class MainController {
    async generateClient(req, res, next) {
        try {
            const baselines = await Baseline.findAll()
            const discounts = await Discount.findAll()
            const segments = serverConfiguration.unusedSegments
            const categories = serverConfiguration.microcategoryTree.microcategoriesNamesInArray
            const locations = serverConfiguration.locationTree.locationsNamesInArray
            return res.json({
                "baselines": baselines,
                "discounts": discounts,
                "unused_segments": segments,
                "categories": categories,
                "locations": locations
            })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async configureServer(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const {id, active, upSeg} = req.body

            if (Array.isArray(id)) {
                return next(ApiError.configurationError(
                    "Одновременно может быть активна только одна Baseline-матрица"
                ))
            }

            if (id) {
                await Baseline.update({active: false}, {where: {}, transaction: t})
                await Baseline.update({active: true}, {where: {id: id}, transaction: t})

            }

            await Discount.update({active: false}, {where: {}, transaction: t})


            for (const discount of upSeg) {
                await Discount.update(
                    {segment: discount["segment"]},
                    {where: {id: discount["id"]}, transaction: t}
                )
            }

            await Discount.update({active: true}, {where: {id: active}, transaction: t})


            await t.commit()
            serverConfiguration.reInitializeServer()

            axios.get(`${process.env.COST_SERVER}/api/main/reConfig`).then(function (response){
                console.log(response)
            }).catch(function (error) {
                console.log(error)
            }).finally(function () {
                console.log("200")
            })

            return res.json(200)
        } catch (e) {
            await t.rollback()
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new MainController()