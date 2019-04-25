
var fs = require('fs');
fs.readdir(path, function(err, items) {
  console.log(items);

  for (var i=0; i<items.length; i++) {
      console.log(items[i]);
  }
});

const tools = require('auth0-extension-express-tools');

const expressApp = require('./server');
const config = require('./server/lib/config');



const logger = require('./server/lib/cow');

const createServer = tools.createServer((config, storage) => {
  logger.info('Starting Auth0 Logging Extension - Version:', process.env.CLIENT_VERSION);
  return expressApp(config, storage);
});

module.exports = (context, req, res) => {
  const publicUrl = (req.x_wt && req.x_wt.ectx && req.x_wt.ectx.PUBLIC_WT_URL) || false;
  if (!publicUrl) {
    config.setValue('PUBLIC_WT_URL', tools.urlHelpers.getWebtaskUrl(req));
  }

  createServer(context, req, res);
};
