require('dotenv').config()
import path from 'path'
import request from 'supertest'
import express from '../src/index.js'

describe('ROUTE: /api/packages/info', () => {
  test('returns an array', done => {
    const app = express({ basePath: '/' })

    request(app)
      .get('/api/packages/info')
      .then(res => {
        expect(res.statusCode).toBe(200)
        done()
      })
  })

  test(`honors express({ basePath: '/somewhere' }) option`, done => {
    const app = express({ basePath: '/foo' })

    request(app)
      .get('/foo/api/packages/info')
      .then(res => {
        expect(res.statusCode).toBe(200)
        done()
      })
  })

  test(`honors CLIENT_ROOT_URL env`, done => {
    let basePath = process.env.CLIENT_ROOT_URL
    const app = express()

    request(app)
      .get(path.join(basePath, '/api/packages/info'))
      .then(res => {
        expect(res.statusCode).toBe(200)
        done()
      })
  })
})
