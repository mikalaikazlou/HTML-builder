const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt');
let data = '';

let stream = fs.createReadStream(pathToFile);
stream.setEncoding('utf-8');

stream.on('error', (error) => {
  console.log('Exception: ' + error);
});
stream.on('data', (dataPart) => {
  data += dataPart;
});
stream.on('end', () => {
  console.log(data);
  stream.destroy();
});