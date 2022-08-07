// 当 undefined、null 才会返回右边的值
let g = null;
let res = g ?? 1;
// console.log(res);

// 给函数传参时，只有undefined才会触发默认值
function run(a, g = '默认', c) {
  //   let gg = g ?? '右边';
  console.log('a:', a, '\ng:', g, '\nc:', c);
}

// run(1, undefined, 3);

// 测试默认参和展开
// 传入的第一个参数= comp = 1
// 其余参数 = ...args = [23,4]
function run_1(comp, ...args) {
  console.log('comp:', comp);
  console.log('args:', args);
}
// run_1(1, 23, 4);

// 测试失败
// 测试多个默认参与展开
// 传入的第一个参数 = comp = 1
// 传入的第二个参数 = sonComp = 2
// 剩下的当作msg = ...args
function run_2(comp, sonComp = 'No SonComp', args) {
  console.log('comp:', comp);
  console.log('SonComp:', sonComp);
  console.log('msg:', args);
}
// run_2(1, undefined, 3);

// 获取时间
let date = new Date();
// console.log(date.toLocaleDateString());
// console.log(date.toLocaleString());
// console.log(date.toLocaleTimeString());

// 测试event
function a() {
  console.log(a.name);
  return 111;
}
function b() {
  console.log(a());
}
b();
