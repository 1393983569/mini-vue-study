import { hasOwn } from "../shared/index"

// 定义map结构便于扩展
const publicPropertiesMap = {
    $el: (i) => i.vnode.el
}

// 把proxy里的get提出作为优化点
export const PubliceInstancePorxyHandlers = {
    get({_: instance}, key) {
      console.log('组件内部访问值key是：', key)
      // 应为proxy会监听vnode里的所有对象，所以限制只取以下对象中的数据，避免造成取值错误。
      const { setupState, props } = instance
      
      if (hasOwn(setupState, key)) {
        return setupState[key]
      } else if (hasOwn(props, key)) {
        console.log(props[key], key)
        return props[key]
      }
      // 获取$el等等
      const publiceGetter = publicPropertiesMap[key]
      if (publiceGetter) {
        return publiceGetter(instance)
      }
    }
}