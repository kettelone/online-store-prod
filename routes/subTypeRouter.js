const Router = require('express')
const router = new Router()
const subTypeController = require('../controllers/subTypeController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), subTypeController.create)
router.get('/', subTypeController.getAll)

module.exports = router
