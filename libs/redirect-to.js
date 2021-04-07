function redirectTo(res, to = undefined, defaultPath = '/') {
  if (to) {
    res.redirect(to);
  } else {
    res.redirect(defaultPath);
  }
}

module.exports = redirectTo;