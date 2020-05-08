'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    userid: DataTypes.INTEGER,
    role: DataTypes.STRING
  }, {});
  Role.associate = function(models) {
    Role.belongsTo(models.User);
  };
  return Role;
};