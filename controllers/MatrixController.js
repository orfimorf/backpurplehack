const db = require("../db");
const ApiError = require("../errors/ApiError");
const serverConfiguration = require('../ServerConfiguration')


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
            let sql = `SELECT id, microcategory_id, location_id, price FROM ${nameMatrix} where `

            if (categories) {
                sql = sql + `microcategory_id=ANY(ARRAY[${categories}])`
                flag = true
            }

            if (flag && locations) {
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
                    "price": item.price
                }
            })

            return res.json(result)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


}

module.exports = new MatrixController()