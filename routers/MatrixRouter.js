const Router = require('express')
const matrixController = require('../controllers/MatrixController')



const router = new Router()


router.post('/get', matrixController.getMatrix)


module.exports = router