const checkPage = require("../../../../source/js/partials/check-page");
require("./partials/upload-files").init();

if (checkPage('edit-portfolio')) {
  require('./partials/editor').default;
  require('./partials/editing-fields');
  require('./partials/add-intro-images');
  require('./partials/input-send-to-cloud').init();
  require('./partials/change-images-view');
}

if (checkPage('edit-page')) {
  require('./partials/editor').default;
  require('./partials/editing-fields');
  require('./partials/input-send-to-cloud').init();
}