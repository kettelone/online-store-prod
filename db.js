/*An ORM is simply an Object Relational Mapper 
that helps in data manipulation and querying 
by the use of objects from the database */

const { Sequelize } = require('sequelize')

module.exports = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
    },
  },
})
// new Sequelize(
//   process.env.DB_NAME, // Название БД
//   process.env.DB_USER, // Пользователь
//   process.env.DB_PASSWORD, // ПАРОЛЬ
//   {
//     dialect: 'postgres',
//     protocol: 'postgres',
//     ssl: true,
//     dialectOptions: {
//       ssl: true,
//       native: true,
//     },
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//   }
// )

new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
    },
  },
})
