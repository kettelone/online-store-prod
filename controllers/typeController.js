const { Type } = require('../models/models')
// const ApiError = require('../error/ApiError')

class TypeController {
  async create(req, res) {
    const { name } = req.body
    const type = await Type.create({ name })
    return res.json(type)
  }

  async editTypeName(req, res) {
    const { id, name } = req.body.params.id
    const type = await Type.findOne({
      where: { id },
    })
    type.name = name
    await type.save()
    return res.json(type)
  }

  async getAll(req, res) {
    const types = await Type.findAll()
    return res.json(types)
  }
}

module.exports = new TypeController()
