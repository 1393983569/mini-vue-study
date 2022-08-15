export function extend (_obj: any, obj: any) {
    return Object.assign(_obj, obj)
} 

export function isObject (obj: any) {
    return obj !== null && typeof obj === 'object'
}
