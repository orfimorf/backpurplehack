const Router = require('express')

const matrixRouter = require('./MatrixRouter')
const mainRouter = require('./MainRouter')

const router = new Router()

router.use('/matrix', matrixRouter)
router.use('/main', mainRouter)

module.exports = router
