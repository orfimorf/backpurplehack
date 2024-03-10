const {json} = require('sequelize')
const ApiError = require('../errors/ApiError')
const User = require("../entities/User");

class UserController {
    async getCost(req, res, next) {
        try {
            const {location_id, microcategory_id, user_id} = req.query
            const user = new User(user_id, location_id, microcategory_id)
            return res.json(await user.findCost())
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }
}

module.exports = new UserController()