export function ViewSignal(signal) {
  return function (val, a) {
    console.log(signal);
    console.log(val, a);
  };
}
