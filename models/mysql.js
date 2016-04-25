/**
 * Created by TanMin on 2016/3/7.
 */
var cnf = (require('../config/default-config')).mysql;
var Sequelize = require('sequelize');
var sequelize = new Sequelize(cnf.database, cnf.username, cnf.password, cnf);

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};
