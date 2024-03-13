const Router = require('express')

const userRouter = require('./UserRouter')
const matrixRouter = require('./MatrixRouter')
const mainRouter = require('./MainRouter')

const router = new Router()


router.use('/user', userRouter)
router.use('/matrix', matrixRouter)
router.use('/main', mainRouter)

module.exports = router
