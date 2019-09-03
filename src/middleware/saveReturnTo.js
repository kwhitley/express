export const saveReturnTo = (req, res, next) => {
  let { returnTo } = req.query

  if (returnTo && req.session) {
    console.log(`saving ?returnTo=${returnTo}`)
    req.session.returnTo = returnTo
  }

  next()
}
