const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Searches extends Model {}

Searches.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    search_term: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    results: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'searches',
  }
);

module.exports = Searches;