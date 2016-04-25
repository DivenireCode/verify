/**
 * Created by TanMin on 2016/3/7.
 */
var path = require('path');

var _ = require('lodash'),
    verify = require('../methods/verify'),
    User = require('../models/user');

var _userPath = path.join(__dirname, '../public/html/user');

module.exports = (function () {

    var verifyCnf = {
        'username': {
            'type': 'empty range',
            'min': 2,
            'max': 6
        },
        'password': {
            'type': 'empty range',
            'min': 6,
            'max': 18
        }
    };

    // 过滤非法字段
    function _jsonFilter (keys, data) {
        var res = {};
        _.forEach(keys, function (item) {
           if (item in data) {
               res[item] = data[item];
           }
        });

        return res;
    }

    return {
        viewRegister: function (req, res) {
            res.sendfile('register.html', { root: _userPath });
        },
        viewLogin: function (req, res) {
            res.sendfile('login.html', { root: _userPath });
        },
        viewLogout: function (req,res) {
            if (req.cookies.username) {

            }
            res.sendfile('logout.html', { root: _userPath });
        },
        jsonRegister: function (req, res, next) {
            var userData = _jsonFilter(['username', 'password'], req.body);

            verify
                .check(verifyCnf, userData)
                .success(function () {
                    //注册
                    User.sequelize
                        .query(
                            " INSERT INTO `bbs_user` (`username`, `password`) " +
                            " SELECT " +
                            "    :username, :password " +
                            " FROM " +
                            "    DUAL " +
                            " WHERE NOT EXISTS" +
                            "    (SELECT `id` FROM `bbs_user` WHERE `username` = :username)", { replacements: userData, type: User.sequelize.QueryTypes.INSERT })
                        .done(function (result, row) {
                            if (result) {
                                //res.cookie('name', 'string', { domain: '.myself.com', path: '/user', secure: true, expires: new Date(Date.now() + 900000), httpOnly: true, maxAge: 900000 });
                                res.cookie('username', userData.username, { maxAge: 1000 * 60 * 24 * 3 });
                                res.send({ Code: 0, Message: '注册成功' });
                            } else {
                                res.send({ Code: -1, Message: '用户名已存在' });
                            }
                            console.log(Object.prototype.toString.call(result));
                        })
                    ;
                })
                .error(function (ex) {
                    res.send({ Code: -1, Message: ex });
                })
            ;

        },
        jsonLogin: function (req, res, next) {
            var userData = _jsonFilter(['username', 'password'], req.body);

            verify
                .check(verifyCnf, userData)
                .success(function () {
                    //登录查询
                    User.sequelize
                        .query(
                            "SELECT " +
                            "   a.`username`, b.`count`, count(*) AS `scount` " +
                            "FROM " +
                            "   `bbs_user` AS a, " +
                            "   ( SELECT `username`, `password`, COUNT(*) as `count` FROM bbs_user WHERE `username` = :username ) AS b " +
                            "WHERE " +
                            "   a.`username` = b.`username` AND a.`password` = :password",
                            { replacements: userData, type: User.sequelize.QueryTypes.SELECT }
                        )
                        .done(function (result) {
                            var rJson = result[0];
                            if (!rJson.count) {
                                res.send({ Code: -1, Message: '该用户不存在' });
                            } else if (!rJson.scount) {
                                res.send({ Code: -1, Message: '密码错误' });
                            } else {
                                //res.cookie('name', 'string', { domain: '.myself.com', path: '/user', secure: true, expires: new Date(Date.now() + 900000), httpOnly: true, maxAge:900000 });
                                res.cookie('username', userData.username, { maxAge: 1000 * 60 * 24 * 3 });
                                res.send({ Code: 0, Message: '登录成功' });
                            }
                        })
                    ;
                })
                .error(function (ex) {
                    res.send({ Code: -1, Message: ex });
                })
            ;
        },
        jsonLogout: function (req, res, next) {
            res.clearCookie('username', {});
        }
    }
}());
