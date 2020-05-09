'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    userid:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  Role.associate = function(models) {
    Role.belongsTo(models.User);
  };
  return Role;
};