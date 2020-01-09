require('dotenv').config()

console.log('express-starter imported...')

// import apicache from 'apicache'
import chalk from 'chalk'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import deepmerge from 'deepmerge'
import express from 'express'
import helmet from 'helmet'
import http from 'http'
import morgan from 'morgan'
import path from 'path'
import session from 'express-session'

// local imports
export * from './api/faker'
import healthApi from './api/health'
import packagesApi from './api/packages'
import {
  saveReturnTo,
  embedBasePath,
  upstreamServeIndex,
  downstreamServeIndex,
} from './middleware'

const appRoot = path.resolve()
const cache = () => (req, res, next) => next() //apicache.middleware

const isProduction = process.env.NODE_ENV === 'production'

// accept paths in the format of [undefined, /, /path, /path/, 'path/']

export var serverPath
export var clientPath
export var imagePath

const distPath = 'dist'

// default export is a function to mirror the express() initilization while allowing future options
export default (config = {}) => {
  const {
    initialMiddleware = [],
    basePath = process.env.CLIENT_ROOT_URL || '/',
    useAuth = true,
    useClient = true,
    port = process.env.PORT || 3000,
  } = config

  serverPath = path.join(appRoot, `./${distPath}`)
  clientPath = path.join(serverPath + '/client')
  imagePath = clientPath + '/i'

  // instantiate express
  const app = express()

  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(compression())
  app.use(cors())
  app.use(helmet())
  app.use(morgan(isProduction ? 'tiny' : 'dev'))

  // add session handling for auth
  app.use(
    session({
      secret: '@supergeneric ftw',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  )

  // register each middleware
  initialMiddleware.forEach(mw => app.use(mw))

  // embed basePath in req to avoid express version of prop-drilling
  app.use(embedBasePath(basePath))

  // save returnTo in advance of any redirecting
  app.use(saveReturnTo)

  if (useClient) {
    // serve injected index ahead of any index.html calls to static
    app.use(basePath, upstreamServeIndex)

     console.log(`serving static content from ${clientPath}`)
    app.use(basePath, express.static(clientPath))
  }

  // built-in adk-express routing goes here
  app.use(basePath, healthApi) // serves /healthz checks
  app.use(basePath, packagesApi) // serves /api/packages/info

  app.start = () => {
    if (!isProduction) {
      console.log(
        chalk.magenta(
          '@supergeneric/express config:',
          JSON.stringify(
            {
              initialMiddleware,
              basePath,
              port,
              useAuth,
              useClient,
              basePath,
            },
            null,
            2
          )
        )
      )
    }

    // if client enabled (default), add catch all to route HTML5 paths to client index
    if (useClient) {
      console.log('using client index serving...')
      // serves all matching routes without extension (to prevent accidental matches on 404 for missing assets) to index.html
      app.use(basePath, downstreamServeIndex)
    }

    // convenience - when base path is set, redirect root calls to base-path
    if (basePath !== '/') {
      app.get('/', (req, res) => res.redirect(basePath))
    }

    // all unmatched get 404
    app.get('*', (req, res) => {
      res.sendStatus(404)
    })

    const server = http.createServer(app)
    console.log(
      `Express server @ http://localhost:${port} (${isProduction ? 'production' : 'development'})\n`
    )
    server.listen(port)
  }

  return app
}
