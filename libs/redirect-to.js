function redirectTo(res, to = undefined, defaultPath = '/', permanent = false) {
  if (to) {
    res.redirect(permanent ? 301 : 302, to);
  } else {
    res.redirect(permanent ? 301 : 302, defaultPath);
  }
}

module.exports = redirectTo;