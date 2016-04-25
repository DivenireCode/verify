/**
 * Created by admin on 2016/3/4.
 */
var verify = require('./methods/verify');
var express = require('express');
var app = express();

(require('./config/express-config'))(app, __dirname);

console.log(verify);
app.use('/user', require('./routes/user'));

app.listen(app.get('port'), function () {
    console.log('listening port ' + app.get('port'));
});