const db = require("../db");
const ApiError = require("../errors/ApiError");



class MatrixController {
    async getMatrix(req, res, next) {
        try {
            const {nameMatrix, ids, categories, locations} = req.body

            let flag = false
            let sql = `SELECT id, microcategory_id, location_id, price FROM ${nameMatrix} where `

            if (ids) {
                sql = sql + `id=ANY(ARRAY[${ids}])`
                flag = true
            }
            if (flag && categories) {
                sql = sql + ` and microcategory_id=ANY(ARRAY[${categories}])`
            } else if (!flag && categories) {
                sql = sql + `microcategory_id=ANY(ARRAY[${categories}])`
                flag = true
            }

            if (flag && locations) {
                sql = sql + ` and location_id=ANY(ARRAY[${locations}])`
            } else if (!flag && locations) {
                sql = sql + `location_id=ANY(ARRAY[${locations}])`
            }

            sql += `;`

            return res.json((await db.query(sql))[0])

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


}

module.exports = new MatrixController()