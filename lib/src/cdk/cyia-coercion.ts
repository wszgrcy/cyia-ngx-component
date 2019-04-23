import * as moment_ from "moment";
const moment = moment_;
/**
 * @description 强制转化为Moment对象,用来显示
 * @author cyia
 * @date 2018-09-15
 * @export
 * @param value 时间值
 * @param [format] 如果需要格式化传入
 * @returns
 */
export function coerceMoment(value: any, format?: string[]): moment_.Moment {
  if (moment.isMoment(value))
    return value
  return moment(value, format)
}

/**
 *
 *
 * @author cyia
 * @date 2019-04-23
 * @export
 * @param value 如果为数值类型则为毫秒数
 * @param [unit='s']
 * @returns
 */
export function coerceCssTimeValue(value: any, unit: string = 's') {
  if (typeof value == 'string') {
    return value
  } else if (typeof value == 'number') {
    if (unit == 's') {
      return `${value / 1000}${unit}`
    } else if (unit == 'ms') {
      return `${value}${unit}`
    }
  }
}
