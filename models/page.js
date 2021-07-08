const multilingualDefault = require("../libs/multilingual-default");

class Page {
  constructor (pageFromDb, userLang = 'en') {
    this.id = pageFromDb.id;
    this.#title = pageFromDb.title;
    this.#excerpt = pageFromDb.excerpt;
    this.#text = pageFromDb.text;
    this.status = pageFromDb.status;
    this.slug = pageFromDb.slug;

    this.userLang = userLang;
  }

  #title;
  #excerpt;
  #text;

  #titleDefault = multilingualDefault;
  #excerptDefault = multilingualDefault;
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

  get excerpt() {
    if (!this.#excerpt) return this.#excerptDefault[this.userLang];
    
    return this.#excerpt[this.userLang];
  }

  get allExcerpts() {
    if (!this.#excerpt) return this.#excerptDefault;
    
    return this.#excerpt;
  }

  get otherExcerpts() {
    const all = {...this.allexcerpts};
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
  Page
};