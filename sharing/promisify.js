const fs = require('fs');

const promisify = fn => (...args) => (
  new Promise((resolve, reject) => 
    fn(...args, (err, data) => (
      err ? reject(err) : resolve(data)
    ))));

const fspromise = promisify(fs.readFile.bind(fs));
fspromise("./promisify.js")
  .then(data => console.log("SUCCESSFUL", data))
  .catch(err => console.log("UNSUCCESSFUL", err));
