const fs = require('fs');
const axios = require('axios');

function cat(path, stringOutputCallback) {
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    stringOutputCallback(`file contents: ${data}`);
  });
}

async function webCat(url, stringOutputCallback) {
  try {
    let response = await axios.get(url);
    stringOutputCallback(`The URL contents are: ${response.data}`);
  } catch (err) {
    console.error(`Error, status code: ${err.response.status}`);
    process.exit(1);
  }
}

function checkForURL(str) {
  return str.slice(0, 4) === 'http';
}

function isLocalOutput() {
  return process.argv[2] === '--out';
}

function makeDiskWriteCallback(destinationPath) {
  function diskWriteCallback(dataString) {
    fs.writeFile(destinationPath, dataString, function(error) {
      if (error) {
        console.error(error);
        process.exit(1);
      } else {
        console.log('Disk write OK!');
      }
    });
  }
  return diskWriteCallback;
}

function handleFilePath() {
  if (isLocalOutput()) {
    var stringOutputCallback = makeDiskWriteCallback(process.argv[3]);
    var sourcePath = process.argv[4];
  } else {
    var stringOutputCallback = console.log;
    var sourcePath = process.argv[2];
  }
  if (checkForURL(sourcePath)) {
    webCat(sourcePath, stringOutputCallback);
  } else {
    cat(sourcePath, stringOutputCallback);
  }
}

handleFilePath();

// if process.argv[2] === --out
//  cat process.argv[4] into (>) process.arvg[3]
// and if process.argv[4] is a url ,
//  cat webCat(process.argv[4]) > process.argv[3]
// refactor cat and webCat to take callbacks
// Need to make a callback for writing things to disk
