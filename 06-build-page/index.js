const { join, parse } = require('path');
const { createWriteStream, createReadStream } = require('fs');
const { readdir, mkdir, copyFile, rmdir, rm } = require('fs/promises');

const targetFolder = 'project-dist';
const copyStylesFrom = join(__dirname, 'styles');
const pathTemplRead = join(__dirname, 'template.html');
const pathWrite = join(__dirname, targetFolder, 'index.html');
const componentsPath = join(__dirname, 'components');

const writeStylesTo = join(__dirname, targetFolder, 'style.css');
const writeStream = createWriteStream(writeStylesTo, { flags: 'w' });
const copyAccetsFrom = join(__dirname, 'assets');
const copyTo = join(__dirname, targetFolder);

const copyAssetsTo = join(__dirname, targetFolder, 'assets');

async function createFolder(path) {
  await mkdir(path, { recursive: true }).catch();
}

async function removeDirectory() {
  await rm(copyAssetsTo, { recursive: true }).catch((_) => {});
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

// merge styles to single file, and copy to project-dist folder

async function readTemplate() {
  const readStream = await createReadStream(pathTemplRead, {
    encoding: 'utf-8',
  });
  const writeStream = await createWriteStream(pathWrite);

  readStream.on('data', async (data) => {
    const contant = data.toString().replaceAll(' ', '').replaceAll('\\n', '');
    // const name = contant.slice(firstIndex + 2, firstIndexCl);
    await getComponent(contant);
    readStream.on('end', () => {
      writeStream.close();
    });
  });
}

async function getComponent(contantText) {
  await readdir(componentsPath, { withFileTypes: true })
    .then(async (data) => {
      const arrTemplates = {};
      let contant = contantText;
      await data.forEach(async (file) => {
        const path = parse(join(componentsPath, file.name));
        if (file.isFile() && path.ext === '.html') {
          console.log(file);

          let firstIndex = contant.indexOf('{{');
          let firstIndexCl = contant.indexOf('}}');
          const name = contant.slice(firstIndex + 2, firstIndexCl);

          if (name.toUpperCase() === path.name.toUpperCase()) {
            const contantStream = createReadStream(
              join(componentsPath, file.name),
              'utf-8',
            );

            contantStream.on('data', (data) => {
              arrTemplates[path.name] = data;
              contant =
                contantText.slice(0, firstIndex - 2) +
                '\n' +
                data.toString() +
                contantText.slice(firstIndexCl + 2);

              console.log(contant);
            });
          }
        }
      });
      console.log(arrTemplates);
    })
    .catch((err) => {
      console.log(err);
    });
}
readTemplate();
