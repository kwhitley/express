require('dotenv').config()

import express from '../src/index.js'
import request from 'supertest'

describe('@supergeneric/express', () => {
  describe('EXPORTS', () => {
    test(`import express from '@supergeneric/express'`, () => {
      expect(typeof express).toBe('function')
    })
  })

  describe(`default export (e.g. import express from '@supergeneric/express')`, () => {
    test('creates a function when instantiated', () => {
      const app = express()
      expect(typeof app).toBe('function')
    })

    test('instantiated server exposes start() function', () => {
      const app = express()
      expect(typeof app.start).toBe('function')
    })

    test('starts without failure', done => {
      const app = express({ basePath: '/' })

      request(app)
        .get('/healthz')
        .then(res => {
          expect(res.statusCode).toBe(200)
          done()
        })
    })
  })

  describe('built-in routes', () => {
    test('/healthz (returns 200)', done => {
      const app = express({ basePath: '/' })

      request(app)
        .get('/healthz')
        .then(res => {
          expect(res.statusCode).toBe(200)
          done()
        })
    })
  })
})
