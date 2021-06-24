class Letter {
  constructor (letterFromDb) {
    this.id = letterFromDb.id;
    this.email = letterFromDb.email;
    this.text = letterFromDb.text;
    this.date = letterFromDb.date;
    this.new = letterFromDb.new;

    this.excerpt = (function() {
      const allWords = letterFromDb.text.split(/ | /);
      if (allWords.length > 10) {
        return allWords.slice(0, 10).join(' ') + '...';
      } else {
        return allWords.join(' ');
      }
    }());

    this.humanDate = (function() {
      const date = new Date(Date.parse(letterFromDb.date))
      return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }());
  }
}

module.exports = {
  Letter
};