/**
 * Created by admin on 2016/3/4.
 */
var express = require('express');
var router = express.Router();

var user = require('../controller/user');

router.get('/register', user.viewRegister);
router.post('/register.json', user.jsonRegister);

router.get('/login', user.viewLogin);
router.post('/login.json', user.jsonLogin);

router.get('/logout', user.viewLogout);
router.post('/logout.json', user.jsonLogout);

module.exports = router;