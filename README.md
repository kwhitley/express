A simplified Express.js environment to serve server + client code.
#### Supports Redis or built-in memory engine with auto-clearing.

# Includes
- [x] gzip compression
- [x] body parsing for form data
- [x] favicon serving
- [x] sessions
- [x] cookies
- [ ] authentication

# Installation
```bash
yarn add @arundo/adk-express
```

# Usage
```js
/* import un-instantiated express app from our starter kit...
   this is a full-fledged express app, ready to accept middleware,
   plugins, routers, etc.  We've added the .start() method to fire
   up the server directly, although you could always start it any other way
   you like.
*/
import express from '@arundo/adk-express'

const app = express()

app.start({
  useClient: true, // defaults to true to route all paths to client-side index.html
}) // custom start() method, launches http listener
```

Env vars supported:

```sh
PORT=3000
NODE_ENV=production
```

# Examples
### Usage with custom API

###### index.js
```js
import express from '@arundo/adk-express'
import api from './api'

const app = express()

app.use('/api', api)

app.start() // custom start() method, launches http listener
```

###### api.js
```js
import express from 'express'

const app = express()

// example route... will be callable from /api/foo
app.get('/foo', (req, res) => {
  res.json({
    success: true,
    path: req.path,
  })
})

export default app
```
