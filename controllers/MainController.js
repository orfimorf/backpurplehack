const ApiError = require('../errors/ApiError')
const {Baseline, Discount} = require('../models')
const sequelize = require('../db')

class MainController {
    async generateClient(req, res, next) {
        try {
            const baselines = await Baseline.findAll()
            const discounts = await Discount.findAll()
            return res.json({
                "baselines": baselines,
                "discounts": discounts
            })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async configureServer(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const {baseline, discounts} = req.body

            if (Array.isArray(baseline)) {
                return next(ApiError.configurationError(
                    "Одновременно может быть активна только одна Baseline-матрица"
                ))
            }

            if (!baseline) {
                return next(ApiError.configurationError(
                    "Должна быть задана хотя бы одна Baseline-матрица"
                ))
            }

            await Baseline.update({active: false}, {where: {}, transaction: t})
            await Discount.update({active: false, segment: null}, {where: {}, transaction: t})

            await Baseline.update({active: true}, {where: {id: baseline["id"]}, transaction: t})
            for (const discount of discounts) {
                await Discount.update(
                    {active: true, segment: discount["segment"]},
                    {where: {id: discount["id"]}, transaction: t}
                )
            }

            /**
             * TODO РЕШИТЬ, КАК КАКАТЬ
             */

            await t.commit()
            return res.json("ок")
        } catch (e) {
            await t.rollback()
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new MainController()