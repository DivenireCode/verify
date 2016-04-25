/**
 * Created by TanMin on 2016/3/7.
 */
var _ = require('lodash');
var collection = require('./mysql');
var Sequelize = collection.Sequelize;
var sequelize = collection.sequelize;

var User = sequelize.define('bbs_user', {
    username: {
        field: 'username',
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(20),
        allowNull: false,
        field: 'password'
    }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    timestamps: false
});

module.exports = _.extend(collection, { db: User });