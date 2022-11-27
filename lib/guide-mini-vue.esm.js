function createVNode(type, props, children) {
    // 这里先直接返回一个 VNode 结构，props、children 非必填
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlags: getShapeFlags(type)
    };
    // 根据children判断子类是字符串还是array
    if (typeof children === 'string') {
        vnode.shapeFlags |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    // slot
    if (2 /* ShapeFlags.STATEFUL_COMPONENT */ & vnode.shapeFlags) {
        if (typeof children === 'object') {
            vnode.shapeFlags |= 16 /* ShapeFlags.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
// 判断当前是否是element还是component类型
function getShapeFlags(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

const extend = Object.assign;
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
// add-click =>  addClick
const acmelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
    });
};
// add => onAdd
const toHandlerKey = (str) => {
    return 'on' + str.slice(0, 1).toUpperCase() + str.slice(1);
};

// 定义map结构便于扩展
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slot: (i) => i.slots,
};
// 把proxy里的get提出作为优化点
const PubliceInstancePorxyHandlers = {
    get({ _: instance }, key) {
        console.log('组件内部访问值key是：', key);
        // 应为proxy会监听vnode里的所有对象，所以限制只取以下对象中的数据，避免造成取值错误。
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            console.log(props[key], key);
            return props[key];
        }
        // 获取$el等等
        const publiceGetter = publicPropertiesMap[key];
        if (publiceGetter) {
            return publiceGetter(instance);
        }
    }
};

const initProps = (instance, rawProps) => {
    // rawProps必须是一个对象
    instance.props = rawProps || {};
    // TODO attrs
};

// 存储依赖的weakMap
const targetMap = new WeakMap();
// 触发更新
function trigger(target, key) {
    // 按照当前触发更新的对象取出depsMap 比如 {fo:要执行的函数}
    const depsMap = targetMap.get(target);
    // 按照key取出dep
    const deps = depsMap.get(key);
    if (!deps)
        return;
    const newDeps = new Set(deps);
    triggerEffects(newDeps);
}
function triggerEffects(deps) {
    // 循环执行依赖
    for (let effect of deps) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);
const set = createSetter();
function createGetter(isReadonly = false, shallow = false) {
    // receiver 当前proxy
    return (target, key, receiver) => {
        // 用于判断是否是reactive
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
            // 用于判断是否是readonly
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        /**
         * 使用Reflect主要是为了避免代理陷阱 触发代理对象的劫持时保证正确的 this 上下文指向
         * Reflect.get()方法用于允许用户从对象获取函数的属性
         * target:它是获取属性的目标对象。
         * propertyKey: 就是要获取的key的名字。
         * receiver: 如果遇到 getter，它是为对象调用提供的 this 值。
         */
        const res = Reflect.get(target, key, receiver);
        if (shallow) {
            return res;
        }
        // 判断是否嵌套
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
// 使用高阶函数
function createSetter() {
    return (target, key, receiver) => {
        const res = Reflect.set(target, key, receiver);
        trigger(target, key);
        return res;
    };
}
// 单独抽离出get 和 set 方法
const mutableHandlers = {
    get,
    set
};
const readonlyHandlers = {
    get: readonlyGet,
    // 只读不需要收集依赖 所以不用执行
    set(target, key, value) {
        // 在这里警告
        console.warn(`key: ${key} set value: ${value} fail, because the target is readonly`, target);
        return true;
    }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});
extend({}, readonlyHandlers, {
    get: shallowReactiveGet
});

// 还可以直接将 createSetter 和 createGetter 分层出去到baseHandlers.ts
// 为了代码的可读性添加一个方法
function createActiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}
function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}

/**
 * 实现emit
 * instance由bind柯里化传入
 * @param instance component实例
 * @param event 事件名称
 * @param arst 参数
 */
const emit = (instance, event, ...arst) => {
    console.log(instance, event);
    const { props } = instance;
    // 获取事件名称
    const hanndlerName = toHandlerKey(acmelize(event));
    const handler = props[hanndlerName];
    handler && handler(...arst);
};

const initSlots = (instance, children) => {
    // instance.slot = Array.isArray(children) ? children : [children]
    const { shapeFlags } = instance.vnode;
    if (16 /* ShapeFlags.SLOT_CHILDREN */ & shapeFlags) {
        nomalizeDlotObject(children, instance.slots);
    }
};
function nomalizeDlotObject(children, slots) {
    // const slot = {}
    for (let key in children) {
        const temp = children[key];
        slots[key] = (props) => nomalizeSlotValue(temp(props));
    }
    // instance.slot = slot
}
function nomalizeSlotValue(temp) {
    return Array.isArray(temp) ? temp : [temp];
}

function createComponentInstance(vnode) {
    // 这里返回一个 component 结构的数据
    const component = {
        vnode,
        // 方便获取type
        type: vnode.type,
        setupState: {},
        emit: () => { },
        slots: {},
        props: {},
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // 初始化分为三个阶段
    // 初始化props
    initProps(instance, instance.vnode.props);
    // 初始化Slots
    initSlots(instance, instance.vnode.children);
    // 处理 setup 的返回值
    // 这个函数的意思是初始化一个有状态的 setup，这是因为在 vue3 中还有函数式组件
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // 这个函数的处理流程其实非常简单，只需要调用 setup() 获取到返回值就可以了
    // 那么第一步我们就是要获取用户自定义的 setup
    // 通过对初始化的逻辑进行梳理后我们发现，在 createVNode() 函数中将 rootComponent 挂载到了 vNode.type
    // 而 vNode 又通过 instance 挂载到的 instance.vnode 中
    // 所以就可以通过这里传入的 instance.vnode.type 获取到用户定义的 rootComponent
    const component = instance.type;
    // 设置代理让组件内部能访问到setup的内容
    instance.proxy = new Proxy({ _: instance }, PubliceInstancePorxyHandlers);
    // 拿到 component 我们就可以拿到 setup 函数
    const { setup, emit } = component;
    // 这里需要判断一下，因为用户是不一定会写 setup 的，所以我们要给其一个默认值
    if (setup) {
        // 获取到 setup() 的返回值，这里有两种情况，如果返回的是 function，那么这个 function 将会作为组件的 render
        // 反之就是 setupState，将其注入到上下文中
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // 这个就是 api 的设计
    // 当返回一个 function 的时候 就把它当成一个 render 来处理了
    // 一般是写 jsx 的时候用   不然的话 又得写一个 render  又得在 setup 中返回 对象 就特别麻烦了  
    // setup() {
    //     return () => <div>我是div</div>;
    //   }
    // TODO function
    if (typeof setupResult === 'object') {
        // 如果是 object ，就挂载到实例上
        instance.setupState = setupResult;
    }
    // 最后一步，调用初始化结束函数
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    // 这里为了获取 component 方便，我们可以在 instance 上加一个 type 属性
    // 指向 vnode.type
    const component = instance.type;
    // 如果 instance.render 没有的话，我们就让 component.render 赋给 instance.render
    // 而没有 component.render 咋办捏，其实可以通过编译器来自动生成一个 render 函数
    // 这里先不写
    // if (instance.render) {
    //   instance.render = component.render
    // }
    instance.render = component.render;
}

function render(vnode, container) {
    // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
    patch(vnode, container);
}
/**
 *
 * @param vnode 组件实例
 * @param container 根节点
 */
function patch(vnode, container) {
    // 去处理组件，在脑图中我们可以第一步是先判断 vnode 的类型
    // 区分element和component类型 element会返回一个string，component会返回一个对象
    if (1 /* ShapeFlags.ELEMENT */ & vnode.shapeFlags) {
        processElement(vnode, container);
    }
    else {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // 这里分为初始化（mount）和更新（update）
    mountElement(vnode, container);
}
// 处理element类型
function mountElement(vnode, container) {
    // vonde => element => div
    const el = (vnode.el = document.createElement(vnode.type));
    const { shapeFlags } = vnode;
    // 判断当前children是否是一个字符串
    if (4 /* ShapeFlags.TEXT_CHILDREN */ & shapeFlags) {
        el.textContent = vnode.children;
        // 判断当前children是否是一个数组  例:[h('p', {class: 'blue'}, 'hello'), h('a', {class: 'blue'}, '去美甲')]
    }
    else if (8 /* ShapeFlags.ARRAY_CHILDREN */ & shapeFlags) {
        mountChildren(vnode, el);
    }
    const { props } = vnode;
    // 处理props属性
    for (let key in props) {
        const val = props[key];
        // 判断是否是事件on开头
        const siOn = key => /^on[A-Z]/.test(key);
        if (siOn(key)) {
            const event = key.slice(2).toLowerCase();
            // 注册事件
            el.addEventListener(event, val);
        }
        else {
            // 添加属性
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(item => {
        patch(item, container);
    });
}
function processComponent(vnode, container) {
    return mountComponent(vnode, container);
}
/**
 *
 * @param vnode 组件实例
 * @param container 根节点
 */
function mountComponent(initialVNode, container) {
    // 通过 vnode 获取组件实例
    const instance = createComponentInstance(initialVNode);
    // setup component
    // 初始化props 初始化slots 调用setupStatefulComponent处理 setup 的返回值
    setupComponent(instance);
    // 执行render
    setupRenderEffect(instance, initialVNode, container);
}
/**
 *
 * @param instance 组件实例
 * @param vnode component的虚拟节点
 * @param container
 */
function setupRenderEffect(instance, initialVNode, container) {
    // setup的代理 用于获取setup里的值,比如组件里的<div>{{this.msg}}</div>
    const { proxy } = instance;
    // 调用 render 和 patch 挂载到 component
    const subTree = instance.render.call(proxy);
    // 下面就是 mountElement 了
    patch(subTree, container);
    // 待mountElement处理完成后就可以获取到div的实例也就是根节点
    initialVNode.el = subTree.el;
}

// rootComponent就是App
function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 在 vue3 中，会将 rootComponent 转为一个虚拟节点 VNode
            // 后续所有的操作都会基于虚拟节点
            // 这里就调用了一个 createVNode 的 API 将 rootComponent 转换为一个虚拟节点
            // 【注意了】这个虚拟节点就是程序的入口，所有子节点递归处理
            // rootComponent 就是#app
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

const renderSlot = (vonde, name, props) => {
    const temp = vonde[name];
    return createVNode('div', {}, temp(props));
};

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h, renderSlot };
