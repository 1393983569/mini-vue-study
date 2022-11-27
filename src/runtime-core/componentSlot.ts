import { ShapeFlags } from '../shared/shapeFlags'

export const initSlots = (instance, children) => {
    // instance.slot = Array.isArray(children) ? children : [children]
    const { shapeFlags } = instance.vnode
    if (ShapeFlags.SLOT_CHILDREN & shapeFlags) {
        nomalizeDlotObject(children, instance.slots)
    }
}

function nomalizeDlotObject(children, slots) {
    // const slot = {}
    for (let key in children) {
        const temp = children[key]
        slots[key] = (props) => nomalizeSlotValue(temp(props))
    }
    // instance.slot = slot
}

function nomalizeSlotValue(temp) {
    return Array.isArray(temp) ? temp : [temp]
}
