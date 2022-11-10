export const extend = Object.assign

export function isObject (obj: any) {
    return obj !== null && typeof obj === 'object'
}

export function hasChanged (newVal, _value) {
    // 使用Object.is()不去使用===是应为会更加严谨，比如 +0 -0 在 ‘===’是相等 Object.is()就不会
    return Object.is(newVal, _value)
}

export const hasOwn = (val: Object, key: any) => Object.prototype.hasOwnProperty.call(val, key)

// add-click =>  addClick
export const acmelize = (str: String) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : ''
    })
}

// add => onAdd
export const toHandlerKey = (str: any) => {
    return 'on' + str.slice(0, 1).toUpperCase() + str.slice(1)
}

export * from './shapeFlags'
