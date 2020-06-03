const path = require('path');

try {
  require(path.join(process.env.PWD, './src/index'));
  console.log('SSR require test PASS');
} catch (e) {
  console.error('SSR require test error');
  throw Error(e);
}
