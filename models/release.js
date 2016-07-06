var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var releaseSchema   = new Schema({
    id: String,
    appPackageName: String,
    appPlatform: String,
    apkDownloadLink: String,
    ipaLink: String,
});

module.exports = mongoose.model('release', releaseSchema);