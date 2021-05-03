const checkPage = require("../../../../source/js/partials/check-page");
require("./partials/upload-files").init();

if (checkPage('edit-portfolio')) {
  require('./partials/editor');
  require('./partials/add-intro-images');
  require('./partials/input-send-to-cloud').init();
}