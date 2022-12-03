import { createVNode, Fragment } from "./vnode"

export const renderSlot = (vonde, name, props) => {
    const temp = vonde[name]
    if (temp) {
        if (typeof temp === 'function') {
            return createVNode('div', {}, temp(props))
        }
    }
} 