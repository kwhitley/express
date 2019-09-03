import apicache from 'apicache'
import express from 'express'
import fs from 'fs-extra'

import { clientPath } from '../index'
import { configInjection, scriptWrapped } from '../lib/config'

const cached = apicache.middleware('1 week')

export const serveIndex = (req, res) => {
  console.log('Redirect from', req.path, 'to', clientPath + '/index.html')
  fs.readFile(clientPath + '/index.html', 'utf8')
    .then(content => {
      // get <script> wrapped variable injection block
      let configScriptBlock = scriptWrapped(configInjection)

      // inject block into existing index.html, just prior to </head>
      content = content.replace(/(<\/head>)/gi, `\t${configScriptBlock}\n\t$1`)

      // return
      res.type('text/html').end(content)
    })
    .catch(err => res.status(500).send('There was a problem loading index.html'))
}

// upstreamServeIndex is used upstream of any static index.html serving
export const upstreamServeIndex = express()

//downstreamServeIndex is used as a final catch-all for client side routing
export const downstreamServeIndex = express()

// force serve index.html (alias /) before connecting to static route
upstreamServeIndex.get('/', cached, serveIndex)
upstreamServeIndex.get('/index.html', cached, serveIndex)

// catches all non-extension based client-side routes as a final pass before serving
downstreamServeIndex.get(/.*(?<!\.\w{1,4})$/, cached, serveIndex)
