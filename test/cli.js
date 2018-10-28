const tape = require('tape');
const fs = require('fs');
const spawn = require('tape-spawn');

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

deleteFolderRecursive('bin');

tape('CLI', function (t) {
  t.test('List versions - empty', function (st) {
    var spt = spawn(st, 'node ./solc-vm ls');
    spt.stdout.empty();
    spt.stderr.empty();
    spt.end();
  });

  t.test('Install Version 0.4.25', function (st) {
    var spt = spawn(st, 'node ./solc-vm install 0.4.25');
    spt.stdout.match(RegExp('(0.4.25 installed)'));
    spt.stderr.empty();
    spt.end();
  });

  t.test('List versions - after install 0.4.25', function (st) {
    var spt = spawn(st, 'node ./solc-vm ls');
    spt.stdout.match(RegExp('(0.4.25)'));
    spt.stderr.empty();
    spt.end();
  });

  t.test('Install Version 0.4.25 - already installed', function (st) {
    var spt = spawn(st, 'node ./solc-vm install 0.4.25');
    spt.stdout.match(RegExp('(0.4.25 is already installed)'));
    spt.stderr.empty();
    spt.end();
  });

  t.test('solc version match', function (st) {
    var spt = spawn(st, 'node ./solc-vm using 0.4.25 --version');
    spt.stdout.match(RegExp('(0.4.25)'));
    spt.stderr.empty();
    spt.end();
  });

  t.test('Using version 0.4.24 - Download', function (st) {
    var spt = spawn(st, 'node ./solc-vm using 0.4.24 test/storage.sol');
    spt.stdout.match(RegExp('(Downloading version 0.4.24)'));
    spt.stderr.empty();
    spt.end();
  });

  t.test('Using version from pragma file', function (st) {
    var spt = spawn(st, 'node ./solc-vm test/storage.sol');
    spt.stdout.match(RegExp('(Found compatible version 0.4.25)'));
    spt.stderr.empty();
    spt.end();
  });

  t.test('Compile ABI', function (st) {
    var spt = spawn(st, 'node ./solc-vm using 0.4.25 test/storage.sol --abi');
    spt.stdout.match(RegExp('(constant)'));
    spt.stderr.empty();
    spt.end();
  });

  t.test('Uninstall Version 0.4.25', function (st) {
    var spt = spawn(st, 'node ./solc-vm uninstall 0.4.25');
    spt.stdout.match(RegExp('(0.4.25 uninstalled)'));
    spt.stderr.empty();
    spt.end();
  });

  t.test('Uninstall Version 0.4.24', function (st) {
    var spt = spawn(st, 'node ./solc-vm uninstall 0.4.24');
    spt.stdout.match(RegExp('(0.4.24 uninstalled)'));
    spt.stderr.empty();
    spt.end();
  });

  t.test('List versions - after uninstall', function (st) {
    var spt = spawn(st, 'node ./solc-vm ls');
    spt.stdout.empty();
    spt.stderr.empty();
    spt.end();
  });

  // t.test('no parameters', function (st) {
  //   var spt = spawn(st, './solcjs');
  //   spt.stderr.match(/^Must provide a file/);
  //   spt.end();
  // });

  // t.test('no mode specified', function (st) {
  //   var spt = spawn(st, './solcjs test/' + daodir + '/Token.sol');
  //   spt.stderr.match(/^Invalid option selected/);
  //   spt.end();
  // });

  // t.test('--bin', function (st) {
  //   var spt = spawn(st, './solcjs --bin test/' + daodir + '/Token.sol');
  //   spt.stderr.empty();
  //   spt.succeeds();
  //   spt.end();
  // });

  // t.test('invalid file specified', function (st) {
  //   var spt = spawn(st, './solcjs --bin test/fileNotFound.sol');
  //   spt.stderr.match(/^Error reading /);
  //   spt.end();
  // });

  // t.test('--abi', function (st) {
  //   var spt = spawn(st, './solcjs --abi test/' + daodir + '/Token.sol');
  //   spt.stderr.empty();
  //   spt.succeeds();
  //   spt.end();
  // });

  // t.test('--bin --abi', function (st) {
  //   var spt = spawn(st, './solcjs --bin --abi test/' + daodir + '/Token.sol');
  //   spt.stderr.empty();
  //   spt.succeeds();
  //   spt.end();
  // });
});
