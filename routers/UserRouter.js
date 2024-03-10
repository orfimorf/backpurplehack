const Router = require('express')
const userController = require('../controllers/UserController')

const router = new Router()

router.get('/getCost', userController.getCost)

module.exports = router