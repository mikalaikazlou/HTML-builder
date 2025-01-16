const fs = require('fs');
const path = require('path');
const {stdin: input} = require('process');

const stopWord = 'exit';
const filePath = path.join(__dirname, 'text.txt');
const writeStrem = fs.createWriteStream(filePath, { flags: 'w' }, 'utf-8');

function isGreeting(isGreeting) {
  if (isGreeting) {
    console.log("\n\t\t\tENTER THE TEXT! \n *** TO COMPLETE THE INPUT, PRESS 'CTRL + C' OR TYPE 'EXIT' ***\n");
  } else{
      console.log("\n\t\t\t GOODBYE!!\n");
    }
}

function finishReading() {
  writeStrem.end();
  isGreeting(false);
  process.exit();
}

function checkStopEntering(string) {
  let str = string.toString().replaceAll(' ', '').trim();
  if (str.match(stopWord)) {
    if (str.lastIndexOf(stopWord) === str.length - stopWord.length) {
      const lastExitWord = string.toString().lastIndexOf(stopWord);
      writeStrem.write(string.toString().slice(0, lastExitWord));      
      finishReading();
    }
  }
}

isGreeting(true);

input.on('data', (data) => {
  checkStopEntering(data);
  writeStrem.write(data);
});
process.on('SIGINT', () => {  
  finishReading();
});
