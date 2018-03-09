let URI = require('urijs');
let uri = new URI('dashboard').query({}).fragment('');
console.log(uri.toString());