var fs = require('fs');
var path = require('path');
var os = require('os');

let osType = os.type().toLowerCase();

const binaryDirectory = path.join(__dirname, 'bin');

const getBinaryDirectory = function () {
  if (!fs.existsSync(binaryDirectory)) {
    fs.mkdirSync(binaryDirectory);
    if (!osType.startsWith('windows')) {
      fs.chmodSync(binaryDirectory, '0777');
    }
  }
  return binaryDirectory;
};

const getInstalledVersion = function () {
  if (!fs.existsSync(binaryDirectory)) {
    return [];
  }
  let files = fs.readdirSync(binaryDirectory);
  const binFiles = files.filter((item) => {
    if (osType.startsWith('windows')) {
      return item.match(/^(solc-\d+\.\d+\.\d+.exe)$/);
    }
    return item.match(/^(solc-\d+\.\d+\.\d+)$/);
  });
  const versions = binFiles.map((item) => {
    if (osType.startsWith('windows')) {
      return item.substring(5, item.length - 4);
    }
    return item.substring(5, item.length);
  });
  return versions;
};

const removeBinary = function (version) {
  if (!fs.existsSync(binaryDirectory)) return;
  fs.unlinkSync(path.join(binaryDirectory, binaryName(version)));
};

function binaryName (version) {
  if (osType.startsWith('windows')) {
    return 'solc-' + version + '.exe';
  }
  return 'solc-' + version;
}

function getBinary (version) {
  return path.join(binaryDirectory, binaryName(version));
}

module.exports = { getBinaryDirectory, getInstalledVersion, binaryName, removeBinary, getBinary };
