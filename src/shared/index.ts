export const extend = Object.assign

export function isObject (obj: any) {
    return obj !== null && typeof obj === 'object'
}

export function hasChanged (newVal, _value) {
    // 使用Object.is()不去使用===是应为会更加严谨，比如 +0 -0 在 ‘===’是相等 Object.is()就不会
    return Object.is(newVal, _value)
}

export * from './shapeFlags'
