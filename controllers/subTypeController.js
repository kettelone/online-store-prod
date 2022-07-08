const { SubType } = require('../models/models')
const ApiError = require('../error/ApiError')

class SubTypeController {
  async create(req, res) {
    const { name, typeId } = req.body
    const subtype = await SubType.create({ name, typeId })
    return res.json(subtype)
  }

  async editSubTypeName(req, res) {
    const { id, name } = req.body.params.id
    const subType = await SubType.findOne({
      where: { id },
    })
    subType.name = name
    await subType.save()
    return res.json(subType)
  }

  async getAll(req, res) {
    const subtypes = await SubType.findAll()
    return res.json(subtypes)
  }
}

module.exports = new SubTypeController()
