function getTimeForPrevDaysInISO(days = 1) {
  return (new Date(
    (new Date()).getTime() - 1000 * 60 * 60 * 24 * days
  )).toISOString();
}

module.exports = {
  getTimeForPrevDaysInISO
}