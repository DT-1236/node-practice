const fs = require('fs');
const axios = require('axios');

function cat(path) {
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`file contents: ${data}`);
  });
}

async function webCat(url) {
  try {
    let response = await axios.get(url);
    console.log(`The URL contents are: ${response.data}`);
  } catch (err) {
    console.error(`Error, status code: ${err.response.status}`);
    process.exit(1);
  }
}

function checkForURL(str) {
  return str.slice(0, 4) === 'http';
}

if (checkForURL(process.argv[2])) {
  webCat(process.argv[2]);
} else {
  cat(process.argv[2]);
}
