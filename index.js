require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors()) // чтобы можно было отправлять запросы с браузера
app.use(express.json()) // чтобы приложение могло парсить json формат
app.use(express.static(path.resolve(__dirname, 'static')))
// app.use(express.static(path.join(__dirname, 'build')))
app.use(fileUpload({}))
app.use('/api', router)

//Обработчик ошибок, последний middleware
app.use(errorHandler)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync() // будет сверят состояние базы данных со схемой данных
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
