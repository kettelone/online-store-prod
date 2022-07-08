const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')

router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.post('/', deviceController.create)
router.post('/sign-s3', deviceController.signOne)
router.put('/', deviceController.editOnePrice)
router.put('/edit-weight', deviceController.editOneWeight)
router.put('/edit-image', deviceController.editOneImage)
router.put('/edit-name', deviceController.editOneName)
router.delete('/edit-image', deviceController.deleteOneImage)
router.delete('/', deviceController.deleteOne)

module.exports = router
