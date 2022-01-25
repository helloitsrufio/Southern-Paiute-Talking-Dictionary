const fileUpload = require('express-fileupload')

module.exports = fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
});