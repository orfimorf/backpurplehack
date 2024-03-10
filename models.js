const sequelize = require('../db')
const { DataTypes } = require('sequelize')


const Baseline = sequelize.define('baseline', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: true }

})

module.exports = {
    Baseline
}