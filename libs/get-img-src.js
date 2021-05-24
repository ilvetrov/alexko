function getImgSrc(name, draft = false) {
  return {
    webSrc: draft ? `/admin/resources/drafts/${name}` : `/content/${name}`,
    serverSrc: draft ? `inner-resources/drafts/${name}` : `public/content/${name}`
  }
}

module.exports = getImgSrc;