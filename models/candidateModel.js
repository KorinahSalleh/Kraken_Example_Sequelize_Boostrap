module.exports = function(sequelize, DataTypes) {
  var Candidate = sequelize.define('Candidate', {
    full_name: DataTypes.STRING,
    status: DataTypes.ENUM('FAIL', 'WAIT', 'HIRE')
  }, {
    classMethods: {
      associate: function(models) {
        Candidate.belongsTo(models.Role)
      }
    }
  })

  return Candidate
}
