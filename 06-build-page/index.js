const { join, parse } = require('path');
const { createWriteStream, createReadStream } = require('fs');
const { readdir, mkdir, copyFile, rm,} = require('fs/promises');

const targetFolder = 'project-dist';
const copyTo = join(__dirname, targetFolder);
const copyAccetsFrom = join(__dirname, 'assets');
const copyAssetsTo = join(__dirname, targetFolder, 'assets');
const copyStylesFrom = join(__dirname, 'styles');
const componentsPath = join(__dirname, 'components');
const pathTemplRead = join(__dirname, 'template.html');
const pathWrite = join(__dirname, targetFolder, 'index.html');
const writeStylesTo = join(__dirname, targetFolder, 'style.css');

const writeStream = createWriteStream(writeStylesTo, { flags: 'w' });

async function createFolder(path) {
  await mkdir(path, { recursive: true }).catch();
}

async function removeDirectory() {
  await rm(copyAssetsTo, { recursive: true }).catch((_) => { });
}

// copy the assets folder
async function copyAssets(directory, dest) {
  await removeDirectory().then(async () => {
    await readdir(directory, { withFileTypes: true })
      .then((data) => {
        data.forEach(async (file) => {
          if (file.isDirectory()) {
            const dirPath = join(join(directory, file.name));
            const destPath = join(dest, file.name);
            createFolder(join(copyAssetsTo, destPath));
            copyAssets(dirPath, destPath);
          } else {
            createFolder(join(copyAssetsTo, dest));
            copyFile(
              join(directory, file.name),
              join(copyAssetsTo, dest, file.name),
            );
          }
        });
      })
      .catch((value) => {
        console.log(value);
      });
  });
}

createFolder(copyTo);
copyAssets(copyAccetsFrom, '');

// merge styles to single file, and copy to project-dist folder
readdir(copyStylesFrom)
  .then(async (data) => {
    data.forEach(async (file) => {
      const filePath = parse(join(copyStylesFrom, file));
      if (filePath.ext === '.css') {
        const readStream = createReadStream(join(filePath.dir, file), {
          encoding: 'utf-8',
        });
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

async function readTemplate() {
  const readStream = await createReadStream(pathTemplRead, {
    encoding: 'utf-8',
  });
  readStream.on('data', async (data) => {
    const contant = data.toString();
    setContantsToHtml(contant);
  });
}

function setContantsToHtml(contantText) {
  readdir(componentsPath, { withFileTypes: true })
    .then((data) => {
      data.forEach((file) => {
        const readStream = createReadStream(join(componentsPath, file.name), {encoding: 'utf-8', });
        readStream.on('data', (data) => {
          const filePath = parse(join(copyStylesFrom, file.name));
          const value = `{{${filePath.name}}}`;
          if (contantText.match(value) && filePath.ext === '.html' && file.isFile()) {
            contantText = contantText.replace(value, "\n" + data.trim());
            const writeStrim = createWriteStream(pathWrite, { flags: 'w' });
            writeStrim.write(contantText);
            writeStrim.close();
          }
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

readTemplate();
