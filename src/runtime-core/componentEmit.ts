import { acmelize, toHandlerKey } from "../shared/index"

/**
 * 实现emit 
 * instance由bind柯里化传入
 * @param instance component实例
 * @param event 事件名称
 * @param arst 参数
 */
export const emit = (instance : any, event : any, ...arst : any) => {
    console.log(instance, event)
    const { props } = instance
    // 获取事件名称
    const hanndlerName = toHandlerKey(acmelize(event))
    const handler = props[hanndlerName]
    handler && handler(...arst)
}