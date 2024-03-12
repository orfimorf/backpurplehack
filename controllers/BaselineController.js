const {json} = require('sequelize')
const ApiError = require('../errors/ApiError')
const {Baseline} = require('../models')
const db = require('../db')


class BaselineController {
    async create(req, res, next) {
        try {
            const t =new Date().toLocaleString()
            await db.query(`CREATE TABLE "${t}" AS SELECT * FROM "baseline_matrix_1";`)
            await db.query(`Alter TABLE "${t}" ALTER COLUMN id TYPE SERIAL;`)
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

        // TODO Сверить с фронтами названия переменных в JSON

        const t = await db.transaction()
        try {
            const {name, updates, create, del} = req.body
            const newMatrixName = `baseline_${new Date().toLocaleString()}`

            await Baseline.create({name: newMatrixName},
                {transaction: t})

            if(name){
                await db.query(`CREATE TABLE "${newMatrixName}" AS SELECT * FROM "${name}";`,
                    {transaction: t})
            } else{
                await db.query(`CREATE TABLE "${newMatrixName}"(
                    id integer,
                    microcategory_id integer,
                    location_id integer,
                    price double precision
                    );`,
                    {transaction: t})
                await db.query(`INSERT INTO "${newMatrixName}"(id, microcategory_id, location_id, price) VALUES (${1}, ${1}, ${1}, ${1});`,
                    {transaction: t})
            }

            await t.commit()

            if (updates) {
                for (const r of updates) {
                    await db.query(`UPDATE "${newMatrixName}" SET price=${r.price} WHERE id=${r.id};`)
                }
            }

            if (create) {
                let maxId = await db.query(`SELECT MAX("id") FROM "${newMatrixName}";`)
                maxId = maxId[0][0]['max']

                for (const r of create) {
                    maxId++
                    await db.query(`INSERT INTO "${newMatrixName}"(id, microcategory_id, location_id, price) VALUES (${maxId}, ${r.category}, ${r.location}, ${r.price});`)
                }
            }

            if (del) {
                await db.query(`DELETE FROM "${newMatrixName}" WHERE id=any(array[${del}]);`)
            }

            return res.json(200)

        } catch (e) {
            await t.rollback()
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new BaselineController()