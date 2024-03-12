const Router = require('express')
const baselineRouter= require('../routers/BaselineRouter')
const discountRouter = require('../routers/DiscountRouter')
const userRouter = require('../routers/UserRouter')
const mainRouter = require('../routers/MainRouter')

const router = new Router()

router.use('/baseline', baselineRouter)
router.use('/discount', discountRouter)
router.use('/user', userRouter)
router.use('/main', mainRouter)

module.exports = router
