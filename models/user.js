'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      unique: true
    },
    login:{
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      unique: true
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};


