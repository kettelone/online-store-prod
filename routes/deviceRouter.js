const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')

router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.post('/', deviceController.create)
router.post('/sign-s3', deviceController.signOne)
router.put('/', deviceController.editOne)
router.delete('/', deviceController.deleteOne)

module.exports = router
