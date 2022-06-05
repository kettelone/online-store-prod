const uuid = require('uuid')
const path = require('path')
const { Device, DeviceInfo } = require('../models/models')
const ApiError = require('../error/ApiError')
const { type } = require('os')

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info, weight, subtypeId } = req.body
      const { img } = req.files
      let fileName = uuid.v4() + '.jpg'
      // img.mv(path.resolve(__dirname, '..', 'static', fileName))
      img.mv(path.resolve(__dirname, '..', 'build', fileName))
      const device = await Device.create({
        name,
        price,
        typeId,
        brandId,
        subtypeId,
        img: fileName,
        weight,
      })

      if (info) {
        info = JSON.parse(info)
        info.forEach((i) =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          })
        )
      }

      return res.json(device)
    } catch (e) {
      console.log(e)
      // next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page, subtypeId } = req.query
    page = page || 1
    limit = limit || 9
    let offset = page * limit - limit
    let devices

    console.log(typeId)
    console.log(subtypeId)
    console.log(brandId)

    if (!typeId && !subtypeId && !brandId) {
      devices = await Device.findAndCountAll({ limit, offset })
    }

    if (typeId && !subtypeId && !brandId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      })
    }

    if (!typeId && subtypeId && !brandId) {
      devices = await Device.findAndCountAll({
        where: { subtypeId },
        limit,
        offset,
      })
    }

    if (typeId && subtypeId && !brandId) {
      devices = await Device.findAndCountAll({
        where: { subtypeId },
        limit,
        offset,
      })
    }
    if (brandId && subtypeId) {
      devices = await Device.findAndCountAll({
        where: { subtypeId, brandId },
        limit,
        offset,
      })
    }
    return res.json(devices)
  }

  async getOne(req, res) {
    const { id } = req.params
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    })
    return res.json(device)
  }

  async editOne(req, res) {
    const { id, price } = req.body.params
    const device = await Device.findOne({
      where: { id },
    })
    device.price = price

    await device.save()
  }
}

module.exports = new DeviceController()
