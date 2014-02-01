module.exports = function(sequelize, DataTypes) {
  var Candidate = sequelize.define('Candidate', {
    full_name: DataTypes.STRING,
    status: DataTypes.ENUM('FAIL', 'WAIT', 'HIRE')
  }, {
    classMethods: {
      associate: function(models) {
        Candidate.hasMany(models.Role)
      }
    }
  })

  return Candidate
}
