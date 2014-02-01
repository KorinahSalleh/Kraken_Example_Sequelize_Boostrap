
var data = require('../config/app.json');

var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , lodash    = require('lodash')
  , db        = {}


/*
var sequelize = new Sequelize('test', 'root', null, {
      dialect: 'mysql'
    })
*/

/* How to reuse database.js ? */
var sequelize = new Sequelize(data.databaseConfig.database,
                  data.databaseConfig.username,
                  data.databaseConfig.password,
                  data.databaseConfig.options);


// verify DB connection
sequelize
  .authenticate()
  .complete(function(err) {
    if (err) {
      console.log('Unable to connect to the database:', err)
    } else {
      console.log('Connection has been established successfully.')
    }
  })

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)
