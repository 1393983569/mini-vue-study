export const enum ShapeFlags {
    ELEMENT = 1, // dom 字符串
    STATEFUL_COMPONENT = 1 << 1, // 组件
    TEXT_CHILDREN = 1 << 2, // 字符串
    ARRAY_CHILDREN = 1 << 3, // 数组
    SLOT_CHILDREN = 1 << 4 // 插槽
}