"use strict";

exports.__esModule = true;
exports.createApp = void 0;

var vnode_1 = require("./vnode");

var renderer_1 = require("./renderer"); // rootComponent就是App


function createApp(rootComponent) {
  return {
    mount: function mount(rootContainer) {
      // 在 vue3 中，会将 rootComponent 转为一个虚拟节点 VNode
      // 后续所有的操作都会基于虚拟节点
      // 这里就调用了一个 createVNode 的 API 将 rootComponent 转换为一个虚拟节点
      // 【注意了】这个虚拟节点就是程序的入口，所有子节点递归处理
      // rootComponent 就是#app
      var vnode = vnode_1.createVNode(rootComponent);
      renderer_1.render(vnode, rootContainer);
    }
  };
}

exports.createApp = createApp;