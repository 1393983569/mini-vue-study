import { createVNode } from "./vnode"

export const renderSlot = (vonde, name, props) => {
    const temp = vonde[name]
    return createVNode('div', {}, temp(props))
} 