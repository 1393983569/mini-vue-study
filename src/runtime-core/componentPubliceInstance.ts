// 定义map结构便于扩展
const publicPropertiesMap = {
    $el: (i) => i.vnode.el
}

// 把proxy里的get提出作为优化点
export const PubliceInstancePorxyHandlers = {
    get ({_: instance}, key) {
        const { setupState } = instance
        if (key in setupState) {
          return setupState[key]
        }
        const publiceGetter = publicPropertiesMap[key]
        if (publiceGetter) {
            return publiceGetter(instance)
        }
      }
}