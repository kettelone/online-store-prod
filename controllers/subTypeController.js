const { SubType } = require('../models/models')
const ApiError = require('../error/ApiError')

class SubTypeController {
  async create(req, res) {
    const { name, typeId } = req.body
    const subtype = await SubType.create({ name, typeId })
    return res.json(subtype)
  }

  async getAll(req, res) {
    const subtypes = await SubType.findAll()
    return res.json(subtypes)
  }
}

module.exports = new SubTypeController()
