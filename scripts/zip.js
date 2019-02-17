const zipFolder = require('zip-folder');
zipFolder(`${process.cwd()}/dist`, `${process.cwd()}/github.zip`, err => {
    if (err) {
        console.log('oh no!', err);
    } else {
        console.log(`EXCELLENT ${process.cwd()}\\dist`);
    }
});
