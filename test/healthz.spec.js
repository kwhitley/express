require('dotenv').config()
import path from 'path'
import request from 'supertest'
import express from '../src/index.js'

describe('ROUTE: /healthz', () => {
  test('returns a 200', done => {
    const app = express({ basePath: '/' })

    request(app)
      .get('/healthz')
      .then(res => {
        expect(res.statusCode).toBe(200)
        done()
      })
  })

  test(`honors express({ basePath: '/somewhere' }) option`, done => {
    const app = express({ basePath: '/foo' })

    request(app)
      .get('/foo/healthz')
      .then(res => {
        expect(res.statusCode).toBe(200)
        done()
      })
  })

  test(`honors CLIENT_ROOT_URL env`, done => {
    let basePath = process.env.CLIENT_ROOT_URL
    const app = express()

    request(app)
      .get(path.join(basePath, '/healthz'))
      .then(res => {
        expect(res.statusCode).toBe(200)
        done()
      })
  })
})
