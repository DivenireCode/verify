/**
 * Created by TanMin on 2016/3/4.
 */
var express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    cookie = require('cookie-parser'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    errorHandler = require('errorhandler'),
    path = require('path')
    ;

module.exports = function (app, dirname) {
    app.set('port', process.env.PORT || 3000);
    app.set('views', dirname + '/views');
    app.set('view engine', 'jade');

    //app.use(favicon(''));
    app.use(logger('dev'));
    app.use(methodOverride());
    app.use(session({ resave: true,
        saveUninitialized: true,
        secret: 'uwotm8' }));
    app.use(cookie());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(multer());
    app.use(express.static(dirname + '/public'));
};