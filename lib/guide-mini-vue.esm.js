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
    return vnode;
}
// 判断当前是否是element还是component类型
function getShapeFlags(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

// 定义map结构便于扩展
const publicPropertiesMap = {
    $el: (i) => i.vnode.el
};
// 把proxy里的get提出作为优化点
const PubliceInstancePorxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        // 获取$el等等
        const publiceGetter = publicPropertiesMap[key];
        if (publiceGetter) {
            return publiceGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    // 这里返回一个 component 结构的数据
    const component = {
        vnode,
        // 方便获取type
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // 初始化分为三个阶段
    // TODO initProps()
    // TODO initSlots()
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
    const { setup } = component;
    // 这里需要判断一下，因为用户是不一定会写 setup 的，所以我们要给其一个默认值
    if (setup) {
        // 获取到 setup() 的返回值，这里有两种情况，如果返回的是 function，那么这个 function 将会作为组件的 render
        // 反之就是 setupState，将其注入到上下文中
        const setupResult = setup();
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
    // setupRenderEffect
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

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
