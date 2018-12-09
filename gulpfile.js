const { spawn } = require('child_process');

function start() {
  spawn('./bin/www', [], { stdio: 'inherit' });
}

exports.start = start;
exports.default = start;
