const Router = require('express')
const matrixController = require('../controllers/MatrixController')



const router = new Router()


router.post('/get', matrixController.getMatrix)

router.put('/update', matrixController.update)
router.put('/increase', matrixController.increase)


module.exports = router