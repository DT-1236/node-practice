const fs = require('fs');
const axios = require('axios');

function cat(path, outputPath) {
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    let dataString = `The file contents: ${data}`;
    handleData(dataString, outputPath);
  });
}

async function webCat(url, outputPath) {
  try {
    let response = await axios.get(url);
    let dataString = `The URL contents are: ${response.data}`;
    handleData(dataString, outputPath);
  } catch (err) {
    console.error(`Error, status code: ${err.response.status}`);
    process.exit(1);
  }
}

function handleData(dataString, outputPath) {
  if (outputPath) {
    fs.writeFile(outputPath, dataString, function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  } else {
    console.log(dataString);
  }
}

function checkForURL(str) {
  return str.slice(0, 4) === 'http';
}

function checkForOut() {
  return process.argv[2] === '--out';
}

function handleFilePath() {
  if (checkForOut()) {
    var outputPath = process.argv[3];
    var sourcePath = process.argv[4];
  } else {
    var sourcePath = process.argv[2];
    var outputPath = undefined;
  }
  if (checkForURL(sourcePath)) {
    webCat(sourcePath, outputPath);
  } else {
    cat(sourcePath, outputPath);
  }
}

handleFilePath();

// if process.argv[2] === --out
//  cat process.argv[4] into (>) process.arvg[3]
// and if process.argv[4] is a url ,
//  cat webCat(process.argv[4]) > process.argv[3]
