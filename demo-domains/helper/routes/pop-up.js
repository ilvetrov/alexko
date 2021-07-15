const isDevelopment = require("../../../libs/is-development");
const { langConstructorByCodeName, validateLangName } = require("../../../libs/user-language");
const getView = require("../libs/get-view");
const { insertStyle, insertScript } = require("../libs/insert-file");
const mainDomain = require("../libs/main-domain");

function insertPopUpStyle() {
  return insertStyle('pop-up.css', {
    mainDomain: mainDomain
  });
}

function insertPopUpScript() {
  return insertScript('pop-up.js');
}

const popUpStyles = insertPopUpStyle();
const popUpScripts = insertPopUpScript();

module.exports = function(req, res) {
  const langName = validateLangName(req.data.lang);
  const lang = langConstructorByCodeName(langName);

  res.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8'
	});
  if (req.data.test === 'true') {
    res.write(getView('head', {
      test: true
    }));
  }
  const demoText = lang('demo_text');
  const demoErrorText = lang('demo_error_text');
	res.write(!isDevelopment ? popUpStyles : insertPopUpStyle());
	res.write(getView('demo-pop-up', {
    fromMain: true,
    link: req.data.link,
    popUpName: 'alexko-demo',
    title: lang('demo_site'),
    demoText: demoText,
    lang: lang,
    langName: langName,
    withLogo: true,
    hidden: !!req.data.shown,
    shimmering: true
  }));
	res.write(getView('demo-pop-up', {
    fromMain: true,
    link: req.data.link,
    popUpName: 'alexko-demo-error',
    title: lang('stop') + '!',
    demoText: demoErrorText,
    lang: lang,
    langName: langName,
    hidden: true,
    dataPopUpDoNotShowScrollBarOnHide: true
  }));
	res.write(!isDevelopment ? popUpScripts : insertPopUpScript());
}