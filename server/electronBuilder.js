const packageJson = require("../package.json");
const builder = require("electron-builder");
const fs = require('fs');
const windowmanager = require("windowmanager");

const mimes = new Map();
mimes.set("exe", "exe");
mimes.set("dmg", "dmg");
mimes.set("zip", "zip");
mimes.set("AppImage", "x-executable");

//Development package.json, see https://goo.gl/5jVxoO
const config = packageJson.electronBuilder;

//Application package.json
const appMetadata = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    author: packageJson.author,
    company: packageJson.company
};

function buildPromise(){
    return new Promise((resolve, reject) => {
        builder
            .build({ projectDir: "./", config, appMetadata })
            .then(args => {
                const filePath = args[0];
                const fileName = filePath.substr(filePath.replace(/\\/g,"/").lastIndexOf("/") + 1);
                const ext = fileName.substr(fileName.lastIndexOf(".") + 1);

                let mimeType;
                if (mimes.has(ext))
                    mimeType = `application/${mimes.get(ext)}, application/octet-stream`;
                else
                    console.warn(`Unsupported file type '${ext}' in file '${filePath}'; mime type will be null`);

                resolve({fileName, filePath, mimeType});

            }).catch((error) => {
                console.error(error);
            });
    });
}

module.exports = buildPromise;