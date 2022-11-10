"use strict";
exports.__esModule = true;
exports.PubliceInstancePorxyHandlers = void 0;
var index_1 = require("../shared/index");
// 定义map结构便于扩展
var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
// 把proxy里的get提出作为优化点
exports.PubliceInstancePorxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        console.log('组件内部访问值key是：', key);
        // 应为proxy会监听vnode里的所有对象，所以限制只取以下对象中的数据，避免造成取值错误。
        var setupState = instance.setupState, props = instance.props;
        if (index_1.hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (index_1.hasOwn(props, key)) {
            console.log(props[key], key);
            return props[key];
        }
        // 获取$el等等
        var publiceGetter = publicPropertiesMap[key];
        if (publiceGetter) {
            return publiceGetter(instance);
        }
    }
};
