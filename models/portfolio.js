const { asyncImg } = require("../libs/async-img-loader");
const getImgSrc = require("../libs/get-img-src");
const multilingualDefault = require("../libs/multilingual-default");
const { langConstructorByCodeName } = require("../libs/user-language");

class PortfolioProject {
  static async getAll(admin) {

  }
  static async #createQuery(admin, status = undefined, typeId = undefined) {
    return `
      SELECT * FROM portfolio
      ${!admin.can_edit_all || !!status || !!typeId ? 'WHERE' : ''}

        ${!admin.can_edit_all ? '(admin_id = $<admin_id> OR common = true)' : ''}
        ${!admin.can_edit_all && !!status ? 'AND' : ''}

        ${!!status ? 'status = $<status>' : ''}
        ${(!!status || !admin.can_edit_all) && !!typeId ? 'AND' : ''}

        ${!!typeId ? 'type_id = $<typeId>' : ''}
    `;
  }

  static #processIntroImagesForFront(introImages) {
    const asyncImages = [];
    for (const order in introImages) {
      if (Object.hasOwnProperty.call(introImages, order)) {
        const introImage = introImages[order];
        asyncImages.push(
          asyncImg([getImgSrc(introImage, false)])
        );
      }
    }

    return asyncImages;
  }

  constructor (projectFromDB, userLang = 'en') {
    const lang = langConstructorByCodeName(userLang);
    
    const toLinkVariations = {
      1: lang('open'),
      2: lang('download'),
      3: lang('download'),
    };

    const creatingVariations = {
      1: lang('site_creation'),
      2: lang('app_creation'),
      3: lang('game_creation'),
    };

    this.id = projectFromDB.id;
    this.#title = projectFromDB.title;
    this.#descr = projectFromDB.descr;
    this.#text = projectFromDB.text;
    this.status = projectFromDB.status;
    this.admin_id = projectFromDB.admin_id;
    this.common = projectFromDB.common;
    this.project_date = projectFromDB.project_date;
    this.portfolio_date = projectFromDB.portfolio_date;
    this.type_id = projectFromDB.type_id;
    this.intro_images = projectFromDB.intro_images;
    this.to_link = projectFromDB.to_link;
    this.to_link_text = toLinkVariations[projectFromDB.type_id ?? 2];
    this.to_link_variations = toLinkVariations;
    this.to_link_is_external = !!projectFromDB.to_link?.match(/^http/);
    this.creating_text = creatingVariations[projectFromDB.type_id ?? 2];
    this.creating_variations = creatingVariations;
    this.demo_url = projectFromDB.demo_url;
    this.demo_url_is_external = !!projectFromDB.demo_url?.match(/^http/);
    this.slug = projectFromDB.slug;
    this.imagesView = projectFromDB.images_view || (this.type_id === 1 ? 'horizontal' : 'vertical');
    if (this.intro_images && this.intro_images[this.imagesView === 'horizontal' ? 'desktop' : 'mobile']) {
      this.mainImage = this.intro_images[this.imagesView === 'horizontal' ? 'desktop' : 'mobile'][this.imagesView === 'horizontal' ? 1 : 3];
    }
    if (projectFromDB.type_name) {
      this.type_name = lang(projectFromDB.type_name);
    }
    if (projectFromDB.type_plural_name) {
      this.type_plural_raw_name = projectFromDB.type_plural_name;
      this.type_plural_name = lang(projectFromDB.type_plural_name);
    }
    if (projectFromDB.admin_name) {
      this.admin_name = projectFromDB.admin_name;
    }

    this.userLang = userLang;
  }

  #title;
  #descr;
  #text;

  #titleDefault = multilingualDefault;
  #descrDefault = multilingualDefault;
  #textDefault = multilingualDefault;

  get title() {
    if (!this.#title) return this.#titleDefault[this.userLang];
    
    return this.#title[this.userLang];
  }

  get allTitles() {
    if (!this.#title) return this.#titleDefault;
    
    return this.#title;
  }

  get otherTitles() {
    const all = {...this.allTitles};
    delete all[this.userLang];
    return all;
  }

  get descr() {
    if (!this.#descr) return this.#descrDefault[this.userLang];
    
    return this.#descr[this.userLang];
  }

  get allDescrs() {
    if (!this.#descr) return this.#descrDefault;
    
    return this.#descr;
  }

  get otherDescrs() {
    const all = {...this.allDescrs};
    delete all[this.userLang];
    return all;
  }

  get text() {
    if (!this.#text) return this.#textDefault[this.userLang];
    
    return this.#text[this.userLang];
  }

  get allTexts() {
    if (!this.#text) return this.#textDefault;
    
    return this.#text;
  }

  get otherTexts() {
    const all = {...this.allTexts};
    delete all[this.userLang];
    return all;
  }

  get humanProjectDate() {
    const date = new Date(Date.parse(this.project_date))
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }
  get humanPortfolioDate() {
    const date = new Date(Date.parse(this.portfolio_date))
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  get introImagesForFront() {
    return PortfolioProject.#processIntroImagesForFront(this.imagesView == 'horizontal' ? this.intro_images.desktop : this.intro_images.mobile);
  }
}

module.exports = {
  PortfolioProject
};