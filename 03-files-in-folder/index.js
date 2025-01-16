const fs = require('fs');
const path = require('path');

const deepFolder = 'secret-folder';
const folderPath = path.join(__dirname, deepFolder);

fs.readdir(folderPath, { withFileTypes: true }, (err, elem) => {
    if (err) {
        console.log(err);
    } else {
        elem.forEach((value) => {
            const filePath = path.join(folderPath, value.name);
            const prsPath = path.parse(filePath);
            if (value.isFile()) {
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(prsPath.name + " - " + prsPath.ext.replace('.', '') + " - " + (stats.size / 1024).toFixed(3) + "kb");
                });
            }
        });
    }

});