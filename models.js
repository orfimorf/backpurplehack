const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const Baseline = sequelize.define('baseline', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
}, {timestamps: false})

const Discount = sequelize.define('discount', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    segment: {type: DataTypes.BIGINT, allowNull: true}
}, {timestamps: false})

module.exports = {
    Baseline, Discount
}