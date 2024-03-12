const Router = require('express')
const baselineRouter= require('./BaselineRouter')
const discountRouter = require('./DiscountRouter')
const userRouter = require('./UserRouter')
const matrixRouter = require('./MatrixRouter')
const mainRouter = require('./MainRouter')

const router = new Router()

router.use('/baseline', baselineRouter)
router.use('/discount', discountRouter)
router.use('/user', userRouter)
router.use('/matrix', matrixRouter)
router.use('/main', mainRouter)

module.exports = router
