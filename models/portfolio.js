const multilingualDefault = require("../libs/multilingual-default");

class PortfolioProject {
  constructor (projectFromDB, userLang = 'en') {
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
    this.demo_id = projectFromDB.demo_id;
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
}

module.exports = {
  PortfolioProject
};