/**
 * Created by TanMin on 2016/3/7.
 * 1、未实现联动校验：data1 or data2; data1 and data2
 * 2、未做amd、cmd兼容
 * 3、未支持promise规范
 */
var _ = require('lodash');

module.exports = (function () {
    var self = this;

    // 基本规则
    var defaultRule = {
        range: function (str, min, max) {
            return this.compare(str.length, min, max);
        },
        compare: function (num, min, max) {
            return num >= (min || 0) && (max ? num <= max : 1);
        },

        empty: function (str) {
            return !/^\s*$/.test(str);
        },
        email: function (str) {
            return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(str);
        },
        mobile: function (num) {
            return num.length === 11 ? true : false;
        },

        integer: function (num) {
            return /^[0-9]+$/.test(num);
        },
        float: function (flt) {
            return /^[0-9]+\.[0-9]+$/.test(flt);
        },
        number: function (num) {
            return /^[0-9]+(\.[0-9]+)?$/.test(flt);
        }
    };

    // 空函数
    var noop = function () { return true; };

    // 错误信息
    var errorCache = {
        cache: [],
        push: function (obj) {
            this.cache.push(obj);
        },
        clear: function () {
            this.cache = [];
        },
        cacheJson: function () {
            var _e;
            if (!this.cache.length) return;

            _e = {};
            _.forEach(this.cache, function (item) {
                _e[item.dataKey] = {
                    'type': item.type,
                    'message': item.message
                }
            });

            return _e;
        }
    };

    // 模拟事件，不支持事件队列
    var event = {
        handle: {
            success: noop,
            error: noop
        },
        fire: function (type) {
            this.handle[type](errorCache.cacheJson());
        }
    };

    function _rgistRule (obj) {
        _.extend(defaultRule, obj);
    }

    function _verify (opt, data) {

        errorCache.clear();

        _.forEach(opt, function (item, dkey) {
            if (dkey in data) {
                _.forEach(item.type.split(' '), function (value) {
                    if (value in defaultRule) {
                        !defaultRule[value](data[dkey],
                            ('min' in item ? item.min : null),
                            ('max' in item ? item.max : null))
                        && errorCache.push({ dataKey: dkey, type: value, message: 'error in ' + value });
                    }
                });
            } else {
                errorCache.push({ dataKey: dkey, type: 'lose', message: 'lose ' + dkey });
            }
        });

        if (errorCache.cache.length) {
            event.fire('error');
        } else {
            event.fire('success');
        }
    }

    return {
        defaultRule: defaultRule,
        check: function (opt, data) {
            // 为了连缀调用时，将校验动作挂载在执行队列的最后
            setTimeout(function() { _verify(opt, data); }, 0);
            return this;
        },
        registRule: function (obj) {
            _rgistRule(obj);
            return this;
        },
        success: function (fn) {
            event.handle.success = fn;
            return this;
        },
        error: function (fn) {
            event.handle.error = fn;
            return this;
        }
    }
}());
