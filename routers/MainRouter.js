const Router = require('express')
const mainController = require('../controllers/MainController')

const router = new Router()

router.get('/generateClient', mainController.generateClient)

router.put('/configureServer', mainController.configureServer)

module.exports = router