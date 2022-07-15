const { OrderInfo } = require('../models/models')

const LiqPay = require('./liqpay')
const { v4: uuidv4 } = require('uuid')
const liqpay = new LiqPay(
  process.env.LIQPAY_PUBLIC_KEY,
  process.env.LIQPAY_PRIVATE_KEY
)

class BasketController {
  //Redirect to the LiqPay page providing info for paymnet
  async checkout(req, res) {
    const { amount, basketContent } = req.body.params

    let customDescription = ''
    basketContent.map((item) => {
      customDescription +=
        `*${item.name} - ${item.totalCount} ${item.purchaseUnit} - ${item.price}грн/` +
        '\n'
    })

    const response = liqpay.cnb_object({
      action: 'pay',
      amount,
      currency: 'UAH',
      description: customDescription,
      result_url: process.env.FRONTEND_URL,
      server_url: 'http://localhost:5000/api/basket/liqpay-response',
      order_id: `order_id_${uuidv4()}`,
      version: '3',
    })
    res.send(response)
  }

  //Callback api server url provided to LiqPay to send final payment status(not working!!!!)
  async receiveLiqPayResponse(req, res) {
    try {
      await OrderInfo.create({ req })
      return res.send()
    } catch (e) {
      console.log(e)
    }
    res.status(200).send()
  }

  //Manual option to check the order paymnet status by provided order_id
  async manualStatusCheck(req, res) {
    liqpay.api(
      'request',
      {
        action: 'status',
        version: '3',
        order_id: 'order_id_232344', //specify order_id
      },
      function (json) {
        res.json(json)
        console.log(json)
      }
    )
  }

  //get the list of all the paymnets and its status
  async getAllStatus(req, res) {
    const orders = await OrderInfo.findAll()
    return res.json(orders)
  }
}

module.exports = new BasketController()
