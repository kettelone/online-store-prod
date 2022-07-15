const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')

router.post('/checkout', basketController.checkout)
router.post('/liqpay-response', basketController.receiveLiqPayResponse)
router.post('/liqpay-manual-status-check', basketController.manualStatusCheck)
router.get('/liqpay-all-status-check', basketController.getAllStatus)

module.exports = router
