const Router = require('express')
const discountController = require('../controllers/DiscountController')

const router = new Router()

router.post('/create', discountController.create)

router.get('/get', discountController.get)
router.get('/getAll', discountController.getAll)

router.put('/update', discountController.update)

module.exports = router