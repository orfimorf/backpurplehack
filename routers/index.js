const Router = require('express')
const baselineRouter= require('../routers/BaselineRouter')
const discountRouter = require('../routers/DiscountRouter')
const userRouter = require('../routers/UserRouter')

const router = new Router()

router.use('/baseline', baselineRouter)
router.use('/discount', discountRouter)
router.use('/user', userRouter)

module.exports = router
