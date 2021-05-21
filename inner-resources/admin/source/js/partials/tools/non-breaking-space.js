class NonBreakingSpace {

  static get isInline() {
    return true;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;

    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({api}) {
    this.api = api;
    this.button = null;
    this._state = false;
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = '•=•';
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  surround(range) {
    if (this.checkExistsOfNonBreaking(range)) {
      this.replaceNonBreakingToSpaces(range);
      return;
    }

    this.replaceSpacesToNonBreaking(range);
  }

  replaceSpacesToNonBreaking(range) {
    const selectedText = range.toString();
    range.extractContents();
    const finishText = selectedText.replace(/ +/, ' ');
    range.insertNode(document.createTextNode(finishText));;
  }

  replaceNonBreakingToSpaces(range) {
    const selectedText = range.toString();
    range.extractContents();
    const finishText = selectedText.replace(/ +/g, ' ');
    range.insertNode(document.createTextNode(finishText));;
  }

  checkExistsOfNonBreaking(range) {
    const nonBreakingSpaces = range.toString().match(' ');

    this.state = !!nonBreakingSpaces;

    return !!nonBreakingSpaces
  }
  
  checkState(selection) {
    this.checkExistsOfNonBreaking(selection);
  }

}

module.exports = NonBreakingSpace;