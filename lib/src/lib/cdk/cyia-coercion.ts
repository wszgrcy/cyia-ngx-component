import { Moment } from 'moment';
// import { TypeJudgment, jsNativeType } from "cyia-ngx-common";
import * as moment from "moment";
/**
 * 强制转化为Moment对象,用来显示
 *
 * @export
 * @param {*} value 时间值
 * @param {string} [format] 如果需要格式化传入
 */
export function coerceMoment(value: any, format?: string[]) {
  if (value instanceof moment)
    return value
  return moment(value, format)
}

