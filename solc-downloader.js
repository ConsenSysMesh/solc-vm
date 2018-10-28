var fs = require('fs');
var os = require('os');
var path = require('path');
var https = require('follow-redirects').https;
var unzip = require('unzip');
var MemoryStream = require('memorystream');
var targz = require('targz');
const { spawn } = require('child_process');

function getVersionList (cb) {
  console.log('Retrieving available version list...');

  var mem = new MemoryStream(null, { readable: false });
  https.get('https://ethereum.github.io/solc-bin/bin/list.json', function (response) {
    if (response.statusCode !== 200) {
      console.log('Error downloading file: ' + response.statusCode);
      process.exit(1);
    }
    response.pipe(mem);
    response.on('end', function () {
      cb(mem.toString());
    });
  });
}

function binaryFileName (version) {
  let osType = os.type().toLowerCase();
  if (osType.startsWith('windows')) {
    return 'solidity-windows.zip';
  } else if (osType.startsWith('linux')) {
    return 'solc-static-linux';
  } else if (osType.startsWith('darwin')) {
    return `solidity_${version}.tar.gz`;
  }
}

function postProcess (fileName, outputName, cb) {
  let osType = os.type().toLowerCase();
  if (osType.startsWith('windows')) {
    fs.createReadStream(fileName)
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      if (fileName === 'solc.exe') {
        entry.pipe(fs.createWriteStream(outputName));
      } else {
        entry.autodrain();
      }
    })
    .on('close', function () {
      if (cb) cb();
    });
  } else if (osType.startsWith('darwin')) {
    let tempFolder = path.join(__dirname, 'bin');
    let sourceFolder = fileName.substring(0, fileName.length - '.tar.gz'.length);
    let binFile = path.join(fileName.substring(0, fileName.length - '.tar.gz'.length), 'solc', 'solc');
    targz.decompress({
      src: fileName,
      dest: tempFolder
    }, function (err) {
      if (err) {
        console.log(err);
      } else {
        var cmake = spawn('cmake', ['.'], {cwd: sourceFolder});

        cmake.stdout.on('data', (data) => {
          console.log(`${data}`);
        });

        cmake.stderr.on('data', (data) => {
          console.log(`${data}`);
        });

        cmake.on('close', (code) => {
          var make = spawn('make', [], {cwd: sourceFolder});
          make.stdout.on('data', (data) => {
            console.log(`${data}`);
          });
          make.stderr.on('data', (data) => {
            console.log(`${data}`);
          });
          make.on('close', (code) => {
            fs.createReadStream(binFile)
              .pipe(fs.createWriteStream(outputName))
              .on('close', function () {
                fs.chmodSync(outputName, '0755');
                spawn('rm', [fileName]);
                spawn('rm', ['-rf', sourceFolder]);
                if (cb) cb();
              });
          });
        });
      }
    });
  } else if (osType.startsWith('linux')) {
    fs.createReadStream(fileName).pipe(fs.createWriteStream(outputName))
    .on('close', function () {
      fs.chmodSync(outputName, '0755');
      if (cb) cb();
    });
  }
}

function downloadBinary (outputName, version, cb) {
  console.log('Downloading version', version);

  let fileName = binaryFileName(version);
  let tempFile = path.join(__dirname, 'bin', fileName);
  if (!fileName) {
    console.log('Unsupported OS Type.');
    process.exit(1);
  }

  // Remove if existing
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }

  process.on('SIGINT', function () {
    console.log('Interrupted, removing file.');
    fs.unlinkSync(tempFile);
    fs.unlinkSync(outputName);
    process.exit(1);
  });

  var file = fs.createWriteStream(tempFile, { encoding: 'binary' });

  https.get('https://github.com/ethereum/solidity/releases/download/v' + version + '/' + fileName, function (response) {
    if (response.statusCode !== 200) {
      console.log('Error downloading file: ' + response.statusCode);
      process.exit(1);
    }
    response.pipe(file);
    file.on('finish', function () {
      file.close(function () {
        console.log('Done.');
        postProcess(tempFile, outputName, cb);
      });
    });
  });
}

module.exports = { getVersionList, downloadBinary };
