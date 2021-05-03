class PortfolioProject {
  constructor (projectFromDB, userLang = 'en') {
    this.id = projectFromDB.id;
    this.#title = projectFromDB.title;
    this.#descr = projectFromDB.descr;
    this.text = projectFromDB.text;
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

  get title() {
    return this.#title[this.userLang];
  }

  get allTitles() {
    return this.#title;
  }

  get otherTitles() {
    const allTitles = {...this.allTitles};
    delete allTitles[this.userLang];
    return allTitles;
  }

  get descr() {
    return this.#descr[this.userLang];
  }

  get allDescrs() {
    return this.#descr;
  }

  get otherDescrs() {
    const allDescrs = {...this.allDescrs};
    delete allDescrs[this.userLang];
    return allDescrs;
  }

  set title(value) {
    this.#title = value;
  }
  
  set descr(value) {
    this.#descr = value;
  }
}

module.exports = {
  PortfolioProject
};