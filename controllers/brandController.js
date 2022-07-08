const { Brand } = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController {
  async create(req, res) {
    const { name, subtypeId } = req.body
    const brand = await Brand.create({ name, subtypeId })
    return res.json(brand)
  }

  async changeBrandName(req, res) {
    const { id, newBrand } = req.body.params.id
    console.log(id, newBrand)
    const brand = await Brand.findOne({
      where: { id },
    })
    brand.name = newBrand
    await brand.save()
    return res.json(brand)
  }

  async getAll(req, res) {
    const brands = await Brand.findAll()
    return res.json(brands)
  }
}

module.exports = new BrandController()
