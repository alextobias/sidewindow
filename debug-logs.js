const fs = require('fs');

const filepath = "log.txt"

function overwriteLog(line) {
    timestamp = Date()
    fs.writeFile(filepath, `${Date()}: ${line}\n`, err => {
        if(err) {
            console.error(err)
            return
        }
    })
}

function appendLog(line) {
    fs.appendFile(filepath, `${Date()}: ${line}\n`, err => {
        if(err) {
            console.error(err)
            return
        }
    })
}

function readLogAsync() {
    return new Promise(function (resolve, reject) {
        // do the asynchronous operation
        fs.readFile('log.txt', { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                console.log('Error reading file: ' + err)
                // reject the promise in case of error
                reject(err);
            }
            else {
                setTimeout(function () {
                    // resolve the promise after successfull execution of asynchronous code
                    resolve(data);
                }, 3000)
            }
        });
    })
}

function readLogSync() {
    return fs.readFileSync('log.txt')
}

module.exports = {overwriteLog, appendLog, readLogAsync, readLogSync}