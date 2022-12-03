import { ShapeFlags } from '../shared/index'
export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createVNode(type, props?, children?) {
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
        vnode.shapeFlags |= ShapeFlags.TEXT_CHILDREN
    } else if (Array.isArray(children)) {
        vnode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN 
    }
    
    // slot
    if (ShapeFlags.STATEFUL_COMPONENT & vnode.shapeFlags) {
        if (typeof children === 'object') {
            vnode.shapeFlags |= ShapeFlags.SLOT_CHILDREN
        }
    }

    return vnode
}

// 判断当前是否是element还是component类型
function getShapeFlags(type) {
    return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}

// 纯文本
export function createTextVNode(text:String) {
    return createVNode(Text, {}, text)
}
