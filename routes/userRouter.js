const Router = require('express')
const userController = require('../controllers/userControllers')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registartion)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)

module.exports = router
