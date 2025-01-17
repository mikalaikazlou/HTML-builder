const { readdir } = require('fs/promises');
const { join, parse } = require('path');
const { createWriteStream, createReadStream } = require('fs');

const bundleCss = 'bundle.css';
const targetFolder = 'project-dist';
const stylesFolder = join(__dirname, 'styles');
const pathWriteTo = join(__dirname, targetFolder, bundleCss);
const writeStream = createWriteStream(pathWriteTo, { flags: 'w' });

readdir(stylesFolder, 'utf-8')
  .then(async (data) => {
    data.forEach(async (file) => {
      const filePath = parse(join(stylesFolder, file));
      if (filePath.ext === '.css') {
        const readStream = createReadStream(join(filePath.dir, file), {encoding: 'utf-8'});
        readStream.on('data', (data) => {
          writeStream.write(data);
        });
        readStream.on('end', () => {
          writeStream.close();
        });
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
