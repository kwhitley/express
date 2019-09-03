import express from 'express'
import faker from 'faker'
import deepmerge from 'deepmerge'
import { random } from 'supergeneric/math'
import { randomItem } from 'supergeneric/collections'

const AVAILABLE_LAST_NAMES = [
  'Lion', 'Kitty', 'the Cat', 'Feline', 'Puma',
]

const app = express()

let kittens = Array(1000).fill({}).map((k, id) => ({
  id,
  firstName: faker.name.firstName(),
  lastName: randomItem(AVAILABLE_LAST_NAMES),
  age: random(1, 20),
  isReallyACat: Math.random() > 0.3,
  image: faker.image.cats(),
  favoriteToy: random(1, 5),
}))

let construct = (collection = []) => ({
  toys: (base = {}) => ({
    name: 'Something to play with',
    id: collection.length + 1,
    ...base,
  }),
  kittens: (base = {}) => ({
    firstName: faker.name.firstName(),
    lastName: randomItem(AVAILABLE_LAST_NAMES),
    age: random(1, 20),
    isReallyACat: Math.random() > 0.3,
    image: faker.image.cats(),
    favoriteToy: random(1, 5),
    id: collection.length + 1,
    ...base,
  })
})

let toys = [
  {
    id: 1,
    name: 'ball',
  },
  {
    id: 2,
    name: 'string',
  },
  {
    id: 3,
    name: 'yarn',
  },
  {
    id: 4,
    name: 'bone',
  },
  {
    id: 5,
    name: 'dinosaur',
  },
]

const collections = {
  kittens,
  toys,
}

const createItemRoute = (req, res) => {
  let { collectionID, id } = req.params
  let collection = collections[collectionID]

  if (!collection) {
    return res.sendStatus(404)
  }

  let newItem = construct(collection)[collectionID](req.body)

  console.log('CREATE', newItem, req.body)

  collection.push(newItem)

  res.json(newItem)
}

app.get('/randomEndpoint', (req, res) => {
  res.json({ success: true, bar: 'baz', age: 30 })
})

app.get('/:collectionID/create', createItemRoute)
app.post('/:collectionID', createItemRoute)

app.get('/:collectionID/:id?', (req, res) => {
  let { collectionID, id } = req.params
  let { limit = 99 } = req.query
  let collection = collections[collectionID]

  if (!collection) {
    return res.sendStatus(404)
  }

  res.json(id ? collection.find(i => i.id === Number(id)) : collection.slice(0, limit))
})

app.patch('/:collectionID/:id?', (req, res) => {
  let { collectionID, id } = req.params
  let collection = collections[collectionID]

  if (!collection) {
    return res.sendStatus(404)
  }

  let match = collection.find(i => Number(id) === i.id)

  if (!match) {
    return res.sendStatus(400)
  }

  collections[collectionID] = collection.map(i => Number(id) === i.id ? deepmerge(i, req.body) : i)

  res.json(deepmerge(match, req.body))
})

app.delete('/:collectionID/:id?', (req, res) => {
  let { collectionID, id } = req.params
  let collection = collections[collectionID]

  if (!collection) {
    return res.sendStatus(404)
  }

  collections[collectionID] = collection.filter(i => Number(id) !== i.id)
  console.log(collection)

  res.sendStatus(200)
})

app.get('*', (req, res) => res.sendStatus(404))

export default app
