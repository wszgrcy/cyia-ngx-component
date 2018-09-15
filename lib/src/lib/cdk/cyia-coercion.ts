import * as moment from "moment";

/**
 * @description 强制转化为Moment对象,用来显示
 * @author cyia
 * @date 2018-09-15
 * @export
 * @param value 时间值
 * @param [format] 如果需要格式化传入
 * @returns
 */
export function coerceMoment(value: any, format?: string[]) {
  if (value instanceof moment)
    return value
  return moment(value, format)
}

