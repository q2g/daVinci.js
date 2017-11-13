var exec = require('child_process').exec

const packageJson = require("./package.json");

function execCommand (cmd) {
    return new Promise((resolve, reject) => {
        try {
            exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
                resolve(stdout.split("commit"));
            });
        } catch (error) {
            reject(error);
        }

    });
}

function getVersionNumber () {
    return new Promise((resolve, reject) => {
        execCommand("git log")
        .then((logs) => {
            logs.forEach((log) => {
                let pos = log.indexOf("v:");
                if (pos >= 0) {
                    resolve(log.substring(pos+2,pos + 8).trim());
                }
            });
        })
        .catch((error) => {
            console.error("Error in getVersionNumber", error);
            reject(error);
        });
    });
}

function getNumberOfCommits () {
    return new Promise((resolve, reject) => {
        execCommand("git log")
        .then((logs) => {
            let counter = 0;
            logs.shift();
            for (var log of logs) {
                let pos = log.indexOf("v:");
                if (pos >= 0) {
                    resolve(counter);
                    return;
                }
                counter ++;
            }
            resolve(counter);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

function getFullVersionString() {
    return new Promise((resolve, reject) => {
        let str = "";
        getVersionNumber()
        .then((res) => {
            str += res + "+";
            return getNumberOfCommits();
        })
        .then((res) => {
            str += res + "+";
            return execCommand("git rev-parse --abbrev-ref HEAD");
        })
        .then((res) => {
            str += res[0].trim() + "+";
            return execCommand("git rev-parse HEAD");
        })
        .then((res) => {
            resolve(str += res[0].trim());
        })
        .catch((error) => {
            reject(error);
        });
    });
}

module.exports = {
    getVersionNumber : function () { return getVersionNumber()},
    getNumberOfCommits: function () { return getNumberOfCommits()},
    getFullVersionString: function () { return getFullVersionString()}
}