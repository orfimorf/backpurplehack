const Router = require('express')
const router = new Router()

const baselineController = require('../controllers/BaselineController')

router.post('/create', baselineController.create)

router.get('/get', baselineController.get)
router.get('/getAll', baselineController.getAll)

router.put('/update', baselineController.update)

module.exports = router