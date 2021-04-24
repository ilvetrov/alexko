const checkPage = require("../../../../source/js/partials/check-page");

if (checkPage('edit-portfolio')) {
  require('./partials/editor');
}