const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket } = require('../models/models')

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  })
}

class UserController {
  async registartion(req, res, next) {
    const { email, password, phone, firstName, secondName, role } = req.body
    if (!email || !password) {
      return next(ApiError.badRequest('The email or password is incorrect'))
    }
    const candidate = await User.findOne({ where: { email } })
    if (candidate) {
      return next(ApiError.badRequest('The user with this email already exist'))
    }

    const hashedPassword = await bcrypt.hash(password, 5)
    const user = await User.create({
      email,
      role,
      password: hashedPassword,
      phone,
      firstName,
      secondName,
    })
    // const basket = await Basket.create({ userId: user.id })
    const token = generateJwt(
      user.id,
      user.email,
      user.role,
      user.firstName,
      user.secondName,
      user.phone
    )
    return res.json({ token })
  }

  async login(req, res, next) {
    const { email, password } = req.body
    console.log('SERVER', email, password)
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return next(ApiError.internal('User not found'))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Wrong password'))
    }
    const token = generateJwt(user.id, user.email, user.role)
    return res.json({ token })
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role)
    return res.json({ token })
  }

  async fetchUser(req, res, next) {
    const { email } = req.body
    const userInfo = await User.findOne({ where: { email } })
    return res.json({ userInfo })
  }
}

module.exports = new UserController()
