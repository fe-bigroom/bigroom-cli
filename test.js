var cp = require('child_process');
  //exec可以像spawn一样使用
var ls = cp.exec('./bin/index.js dev', {}/*options, [optional]*/);

ls.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

ls.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

ls.on('exit', function (code) {
  console.log('child process exited with code ' + code);
});