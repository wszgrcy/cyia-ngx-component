import { coerceMoment, coerceCssTimeValue } from "./cyia-coercion";

describe('强制转换时间', () => {
  it('undefined', () => {
    //doc 因为undefined传参,相当于没有传入,所以默认调用
    let value = coerceMoment(undefined)
    console.log('undefined', value);
    console.log(value.isValid());
    expect(value.isValid()).toBe(true)
  })
  it('null', () => {
    let value = coerceMoment(null)
    console.log(value.isValid());
    expect(value.isValid()).toBe(false)
  })
  it('string', () => {
    let value = coerceMoment('2019-10-7 11:11')
    console.log(value.valueOf());
    expect(value.isValid()).toBe(true)
  })
})


describe('css中时间转换', () => {
  it('字符串秒', () => {
    expect(coerceCssTimeValue('1s')).toBe('1s')
  })
  it('数字秒', () => {
    expect(coerceCssTimeValue(1)).toBe('0.001s')
  })
  it('数字毫秒', () => {
    expect(coerceCssTimeValue(1, 'ms')).toBe('1ms')
  })
  it('undefined秒', () => {
    expect(coerceCssTimeValue(undefined)).toBe('0s')
  })
  it('null秒', () => {
    expect(coerceCssTimeValue(undefined)).toBe('0s')
  })
  it('undefined毫秒', () => {
    expect(coerceCssTimeValue(undefined, 'ms')).toBe('0ms')
  })
  it('null毫秒', () => {
    expect(coerceCssTimeValue(undefined, 'ms')).toBe('0ms')
  })
  it('nan', () => {
    expect(coerceCssTimeValue(NaN, 'ms')).toBe('0ms')
  })
});