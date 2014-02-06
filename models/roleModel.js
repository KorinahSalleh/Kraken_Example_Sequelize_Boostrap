module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    level: DataTypes.STRING,
    job_desc: DataTypes.STRING(500)
  }, {
    classMethods: {
      associate: function(models) {
        Role.hasMany(models.Candidate);
      }
    }
  })

  return Role
}
