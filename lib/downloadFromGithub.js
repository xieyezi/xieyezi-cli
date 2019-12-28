const download = require('download-git-repo')
/**
 * download template from github
 */
module.exports = function downloadFromGithub(url, name) {
  return new Promise((resolve, reject) => {
    download(`direct:${url}`, name, { clone: true }, function(err) {
      if (!err) {
        resolve()
      }
    })
  })
}
