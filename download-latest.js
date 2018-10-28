#!/usr/bin/env node

const solcManager = require('./solc-manager');
const solcDownloader = require('./solc-downloader');
const path = require('path');
const getVersionList = solcDownloader.getVersionList;
const downloadBinary = solcDownloader.downloadBinary;
const binaryName = solcManager.binaryName;

const fs = require('fs');
const binaryDirectory = solcManager.getBinaryDirectory();

console.log('Downloading latest solidity binary...');

getVersionList(function (list) {
  list = JSON.parse(list);
  let wanted = list.latestRelease;
  let binaryPath = path.join(binaryDirectory, binaryName(wanted));
  downloadBinary(binaryPath, wanted, () => {
    fs.createReadStream(binaryPath).pipe(fs.createWriteStream(path.join(binaryDirectory, binaryName('latest'))));
  });
});
