import express from 'express'
import path from 'path'

const packagePath = path.resolve() + '/package.json'
const pkg = require(packagePath)
const deps = pkg.dependencies || {}

const depVersions = Object.keys(deps).map(name => {
  const depPackagePath = path.resolve() + '/node_modules/' + name + '/package.json'
  const { version } = require(depPackagePath) || {}

  return {
    name,
    requested: deps[name],
    version,
  }
})

const app = express()

app.get('/api/packages/info', (req, res) => res.json(depVersions))

export default app
