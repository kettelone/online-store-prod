const Router = require('express')
const router = new Router()
const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const subTypeRouter = require('./subTypeRouter')
const basketRouter = require('./basketRouter')

router.use('/user', userRouter)
router.use('/basket', basketRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/subtype', subTypeRouter)
router.use('/device', deviceRouter)

module.exports = router
