export const embedBasePath = (basePath = '') => (req, res, next) => {
  req.basePath = basePath

  next()
}
