const { readdir, mkdir, copyFile, unlink, access } = require('fs/promises');
const { join } = require('path');

const fileFolder = 'files';
const copyFolder = 'files-copy';
const copyFrom = join(__dirname, fileFolder);
const copyTo = join(__dirname, copyFolder);

async function removeNotExistFiles(pathChecking, files) {
  if (!files) {
    return;
  }
  await access(pathChecking).then(
    readdir(pathChecking, 'utf-8')
      .then((data) => {
        data.forEach((value) => {
          if (!files.includes(value)) {
            unlink(join(pathChecking, value)).catch(_ => {
              console.log("deletion error");
            });
          }
        });
      })
      .catch(_ => {
        console.log("reading error")
      }),
  ).catch(_ => {
    console.log("the folder does not exist")
  });
}

readdir(copyFrom, 'utf-8')
  .then((data) => {
    mkdir(copyTo, { recursive: true });
    removeNotExistFiles(copyTo, data);
    data.forEach((file) => {
      copyFile(join(copyFrom, file), join(copyTo, file));
    });
  })
  .catch((value) => {
    console.log(value);
  });
