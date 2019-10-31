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
export function coerceMoment(value: string | Date | number | moment.Moment, format?: string): moment.Moment {
  //doc 对于moment也转换,防止相同引用
  //doc 默认对string类型设置格式化
  format = (!format && typeof value == 'string') ? "YYYY-MM-DD HH:mm" : format
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
export function coerceCssTimeValue(value: string | number, unit: 's' | 'ms' = 's') {
  if (typeof value == 'string') {
    return value
  } else if (typeof value == 'number') {
    if (value != value) {
      return `0${unit}`
    }

    if (unit == 's') {
      return `${value / 1000}${unit}`
    } else if (unit == 'ms') {
      return `${value}${unit}`
    }
  } else if (!value) {
    return `0${unit}`
  }
}
