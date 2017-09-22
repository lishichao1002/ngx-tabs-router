let URI = require('urijs');

let uri = new URI('http://localhost:4200/demo2/a?a=1&b=2#2').fragment('');

let path = uri.path();
let query = uri.query(true);

console.log(path);
console.log(JSON.stringify(query));
console.log(uri);

console.log(uri.query(true));

let uri2 = new URI('http://localhost:4200/').query(uri.query()).fragment('abc');
console.log(uri2.toString());

// let a1 = {name: 'zhangsan', age: 10};
// let a2 = {name: 'lisi', age: 11};
// let a3 = {name: 'wagnwu', age: 12};
//
// const {List} = require('immutable');
//
// let list = List([a1, a2, a3]);
// let L = console.log;
// let LogList = () => {
//     let result = '';
//     list.forEach((item) => {
//         result += JSON.stringify(item) + '\n';
//     });
//     L(result);
// };
//
// L(list.size);
//
// LogList();
//
// list.forEach(item => item.age = 13);
//
// LogList();
//
// L(a1 === list.get(0));
//



