const uuid = require('uuid')
const path = require('path')
const aws = require('aws-sdk')
const { Device, DeviceInfo } = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
  async create(req, res, next) {
    try {
      let {
        name,
        price,
        brandId,
        typeId,
        info,
        weight,
        subtypeId,
        imgUrl,
        purchaseUnit,
      } = req.body

      //WHEN FILES WERE DIRECTLY SAVED IN APP
      // const { img } = req.files
      // let fileName = name + uuid.v4() + '.jpg'

      //FOR THE DEVELOPMENT ON LOCALHOST
      // img.mv(path.resolve(__dirname, '..', 'static', fileName))

      //WHEN HOSTED ON HEROKU
      // img.mv(path.resolve(__dirname, '..', 'build', fileName))

      const device = await Device.create({
        name,
        price,
        typeId,
        brandId,
        subtypeId,
        img: imgUrl,
        weight,
        purchaseUnit,
      })

      return res.json(device)
    } catch (e) {
      console.log(e)
      // next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page, subtypeId } = req.query
    page = page || 1
    limit = limit || 10
    let offset = page * limit - limit
    let devices

    if (
      !typeId &&
      !subtypeId &&
      !brandId &&
      page === 'all' &&
      limit === 'all'
    ) {
      devices = await Device.findAndCountAll()
      return res.json(devices)
    }

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

    if (typeId && !subtypeId && brandId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      })
    }

    if (!typeId && !subtypeId && brandId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
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

  async editOnePrice(req, res) {
    const { id, price } = req.body.params.id
    const device = await Device.findOne({
      where: { id },
    })
    device.price = price
    await device.save()
  }

  async editOneWeight(req, res) {
    const { id, weight } = req.body.params.id
    const device = await Device.findOne({
      where: { id },
    })
    device.weight = weight
    await device.save()
  }

  async editOneImage(req, res) {
    const { id, newImgUrl } = req.body.params.id
    const device = await Device.findOne({
      where: { id },
    })
    device.img = newImgUrl
    await device.save()
  }

  async editOneName(req, res) {
    const { id, newName } = req.body.params.id
    const device = await Device.findOne({
      where: { id },
    })
    device.name = newName
    await device.save()
  }

  async signOne(req, res) {
    const s3 = new aws.S3({
      region: 'eu-west-1',
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    })
    const fileName = req.body.name
    const fileType = req.body.type

    const s3Params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      // ACL: 'public-read',
    }

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err)
        return res.end()
      }
      const returnData = {
        signedRequest: data,
        url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`,
      }
      res.write(JSON.stringify(returnData))
      res.end()
    })
  }

  async deleteOne(req, res) {
    const { id } = req.query
    const result = await Device.destroy({
      where: { id },
    })
  }

  async deleteOneImage(req, res) {
    const { imageKey } = req.query

    const s3 = new aws.S3({
      region: 'eu-west-1',
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    })

    try {
      const response = await s3
        .deleteObject({
          Bucket: process.env.S3_BUCKET,
          Key: imageKey,
        })
        .promise()
        .then(
          console.log({
            message: `${imageKey} was succesfully deleted from the bucket ${process.env.S3_BUCKET}`,
          })
        )
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new DeviceController()
