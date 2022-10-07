export function createVNode(type, props?, children?) {
    // 这里先直接返回一个 VNode 结构，props、children 非必填
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode
}