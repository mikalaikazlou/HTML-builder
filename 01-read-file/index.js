const fs = require('fs');
const path = require('path');

const pathToFile = path.format({
    root: '/',
    dir: '01-read-file',
    base: 'text.txt',
});

function getTextFromFile(path) {
  if (!path) {
    return console.log('Path is not valid or empty');
  }
  let text = fs.createReadStream(path);
  text.on('error', (error)=>{
    console.log('***Exception is threw into getTextFromFile function***\n' + error);
  });
  text.on('data', (data)=>{
    console.log(data.toString());
  });
}

getTextFromFile(pathToFile);
