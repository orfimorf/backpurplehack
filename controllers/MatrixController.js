const db = require("../db");
const ApiError = require("../errors/ApiError");
const serverConfiguration = require('../ServerConfiguration')
const {Baseline, Discount} = require("../models");


class MatrixController {
    async getMatrix(req, res, next) {
        try {
            let {nameMatrix, categories, locations} = req.body

            const categoriesIds = []
            categories.forEach(category => {
                categoriesIds.push(...serverConfiguration.microcategoryTree.getSubCategories(category))
            })
            categories = categoriesIds

            const locationsIds = []
            locations.forEach(location => {
                locationsIds.push(...serverConfiguration.locationTree.getSubLocations(location))
            })
            locations = locationsIds

            let flag = false
            let sql = `SELECT id, microcategory_id, location_id, price FROM \"${nameMatrix}\" where `

            if (categories && categories.length > 0) {
                sql = sql + `microcategory_id=ANY(ARRAY[${categories}])`
                flag = true
            }

            if (flag && locations && locations.length > 0) {
                sql = sql + ` and location_id=ANY(ARRAY[${locations}])`
            } else if (!flag && locations) {
                sql = sql + `location_id=ANY(ARRAY[${locations}])`
            }

            sql += `;`

            const response = await db.query(sql)

            const result = response[0].map(item => {
                return {
                    "id": item.id,
                    "category": serverConfiguration.microcategoryTree.getNameById(item.microcategory_id),
                    "location": serverConfiguration.locationTree.getNameById(item.location_id),
                    "value": item.price
                }
            })

            return res.json(result)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        const t = await db.transaction()
        try {
            const {name, updates, create, del} = req.body

            let newMatrixName = '';
            if (name.includes("baseline")) {
                newMatrixName = `baseline_${new Date().toLocaleString()}`
                await Baseline.create({name: newMatrixName},
                    {transaction: t})
            } else {
                newMatrixName = `discount_${new Date().toLocaleString()}`
                await Discount.create({name: newMatrixName},
                    {transaction: t})
            }


            await db.query(`CREATE TABLE "${newMatrixName}" AS SELECT * FROM "${name}";`,
                {transaction: t})


            await t.commit()

            if (updates && updates.length > 0) {
                for (const r of updates) {
                    await db.query(`UPDATE "${newMatrixName}" SET price=${r.price} , microcategory_id=${serverConfiguration.microcategoryTree.getIdByName(r.category)} , location_id=${serverConfiguration.locationTree.getIdByName(r.location)} WHERE id=${r.id};`)
                }
            }

            if (create && create.length > 0) {
                let maxId = await db.query(`SELECT MAX("id") FROM "${newMatrixName}";`)
                maxId = maxId[0][0]['max']

                for (const r of create) {
                    maxId++
                    await db.query(`INSERT INTO "${newMatrixName}"(id, microcategory_id, location_id, price) VALUES (${maxId}, ${serverConfiguration.microcategoryTree.getIdByName(r.category)}, ${serverConfiguration.locationTree.getIdByName(r.location)}, ${r.price});`)
                }
            }

            if (del && del.length > 0) {
                await db.query(`DELETE FROM "${newMatrixName}" WHERE id=any(array[${del}]);`)
            }

            return res.json(200)

        } catch (e) {
            try {
                await t.rollback()
            } catch (e) {
                next(ApiError.badRequest(e.message))
            }
            next(ApiError.badRequest(e.message))
        }
    }

    async increase(req, res, next) {
        const t = await db.transaction()
        try {
            const {name, ids, operator} = req.body
            let {value} = req.body

            let newMatrixName = '';

            if (name.includes("baseline")) {
                newMatrixName = `baseline_${new Date().toLocaleString()}`
                await Baseline.create({name: newMatrixName},
                    {transaction: t})
            } else {
                newMatrixName = `discount_${new Date().toLocaleString()}`
                await Discount.create({name: newMatrixName},
                    {transaction: t})
            }


            await db.query(`CREATE TABLE "${newMatrixName}" AS SELECT * FROM "${name}";`,
                {transaction: t})


            await t.commit()

            switch (operator) {

                case "*": {
                    value = value/100
                    for (let id of ids) {
                        await db.query(`UPDATE "${newMatrixName}" SET price=price+price*${value} WHERE id=${id};`)
                    }
                    return res.json(200)
                }

                case "/": {
                    value = value/100
                    for (let id of ids) {
                        await db.query(`UPDATE "${newMatrixName}" SET price=price-price*${value} WHERE id=${id};`)
                    }
                    return res.json(200)
                }

                case "+": {
                    for (let id of ids) {
                        await db.query(`UPDATE "${newMatrixName}" SET price=price+${value} WHERE id=${id};`)
                    }
                    return res.json(200)
                }

                case "-": {
                    for (let id of ids) {
                        await db.query(`UPDATE "${newMatrixName}" SET price=price-${value} WHERE id=${id};`)
                    }
                    return res.json(200)
                }


            }


        } catch (e) {
            try {
                await t.rollback()
            } catch (e) {
                next(ApiError.badRequest(e.message))
            }
            next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new MatrixController()