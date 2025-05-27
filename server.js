// server.js
import express from 'express'
import path from 'path'
import { Datastore } from '@google-cloud/datastore'

const app = express()
const ds  = new Datastore()

app.use(express.json())

// ── COMMON HELPERS ─────────────────────────────────────────────────────────────
function toKey(kind, id) {
  return ds.key([kind, typeof id === 'string' ? parseInt(id, 10) : id])
}
async function list(kind, orderBy = 'created_at') {
  const query = ds.createQuery(kind).order(orderBy, { descending: true })
  const [entities] = await ds.runQuery(query)
  return entities
}
async function getOne(kind, id) {
  const [entity] = await ds.get(toKey(kind, id))
  return entity
}
async function create(kind, data) {
  const key = ds.key(kind)
  await ds.save({ key, data })
  return { id: key.id }
}
async function update(kind, id, data) {
  await ds.save({ key: toKey(kind, id), data })
}
async function remove(kind, id) {
  await ds.delete(toKey(kind, id))
}

// ── BUDGET ITEMS ──────────────────────────────────────────────────────────────
app.get('/api/budget_items',        async (req, res) => res.json(await list('budget_items')))
app.get('/api/budget_items/:id',    async (req, res) => res.json(await getOne('budget_items', req.params.id)))
app.post('/api/budget_items',       async (req, res) => res.json(await create('budget_items', req.body)))
app.patch('/api/budget_items/:id',  async (req, res) => { await update('budget_items', req.params.id, req.body); res.sendStatus(204) })
app.delete('/api/budget_items/:id', async (req, res) => { await remove('budget_items', req.params.id); res.sendStatus(204) })

// ── IDEAS ITEMS ───────────────────────────────────────────────────────────────
app.get('/api/ideas_items',        async (req, res) => res.json(await list('ideas_items')))
app.get('/api/ideas_items/:id',    async (req, res) => res.json(await getOne('ideas_items', req.params.id)))
app.post('/api/ideas_items',       async (req, res) => res.json(await create('ideas_items', req.body)))
app.patch('/api/ideas_items/:id',  async (req, res) => { await update('ideas_items', req.params.id, req.body); res.sendStatus(204) })
app.delete('/api/ideas_items/:id', async (req, res) => { await remove('ideas_items', req.params.id); res.sendStatus(204) })

// ── INVENTORY ITEMS ───────────────────────────────────────────────────────────
app.get('/api/inventory_items',        async (req, res) => res.json(await list('inventory_items')))
app.get('/api/inventory_items/:id',    async (req, res) => res.json(await getOne('inventory_items', req.params.id)))
app.post('/api/inventory_items',       async (req, res) => res.json(await create('inventory_items', req.body)))
app.patch('/api/inventory_items/:id',  async (req, res) => { await update('inventory_items', req.params.id, req.body); res.sendStatus(204) })
app.delete('/api/inventory_items/:id', async (req, res) => { await remove('inventory_items', req.params.id); res.sendStatus(204) })

// ── MOVIES & GAMES ────────────────────────────────────────────────────────────
app.get('/api/movies_games',       async (req, res) => res.json(await list('movies_games')))
app.get('/api/movies_games/:id',   async (req, res) => res.json(await getOne('movies_games', req.params.id)))
app.post('/api/movies_games',      async (req, res) => {
  const item = {
    ...req.body,
    players: req.body.type === 'Game' ? req.body.players : null
  }
  const { id } = await create('movies_games', item)
  res.json({ id, ...item })
})
app.patch('/api/movies_games/:id', async (req, res) => {
  const item = {
    ...req.body,
    players: req.body.type === 'Game' ? req.body.players : null
  }
  await update('movies_games', req.params.id, item)
  res.sendStatus(204)
})
app.delete('/api/movies_games/:id', async (req, res) => { await remove('movies_games', req.params.id); res.sendStatus(204) })

// ── NEEDS ITEMS ───────────────────────────────────────────────────────────────
app.get('/api/needs_items',        async (req, res) => res.json(await list('needs_items')))
app.get('/api/needs_items/:id',    async (req, res) => res.json(await getOne('needs_items', req.params.id)))
app.post('/api/needs_items',       async (req, res) => res.json(await create('needs_items', req.body)))
app.patch('/api/needs_items/:id',  async (req, res) => { await update('needs_items', req.params.id, req.body); res.sendStatus(204) })
app.delete('/api/needs_items/:id', async (req, res) => { await remove('needs_items', req.params.id); res.sendStatus(204) })

// ── TOOLS ITEMS ───────────────────────────────────────────────────────────────
app.get('/api/tools',        async (req, res) => res.json(await list('tools')))
app.get('/api/tools/:id',    async (req, res) => res.json(await getOne('tools', req.params.id)))
app.post('/api/tools',       async (req, res) => res.json(await create('tools', req.body)))
app.patch('/api/tools/:id',  async (req, res) => { await update('tools', req.params.id, req.body); res.sendStatus(204) })
app.delete('/api/tools/:id', async (req, res) => { await remove('tools', req.params.id); res.sendStatus(204) })

// ── STATIC + CATCH-ALL ────────────────────────────────────────────────────────
const buildDir = path.join(process.cwd(), 'dist')
app.use(express.static(buildDir))
app.get('/*', (req, res) => res.sendFile(path.join(buildDir, 'index.html')))

// ── START SERVER ─────────────────────────────────────────────────────────────
// const port = process.env.PORT || 8080
const port = parseInt(process.env.PORT ?? '8080', 10)
app.listen(port, () => console.log(`🚀 Listening on ${port}`))



// // server.js
// import express from 'express'
// import path from 'path'
// import { Datastore } from '@google-cloud/datastore'

// const app = express()
// const ds  = new Datastore()

// app.use(express.json())

// // 1) Your JSON API under /api
// app.get('/api/items', async (req, res) => {
//   const query = ds.createQuery('Item')
//   const [items] = await ds.runQuery(query)
//   res.json(items)
// })

// // 2) Serve your Vite build
// const buildDir = path.join(process.cwd(), 'dist')
// app.use(express.static(buildDir))
// app.get('*', (req, res) => {
//   res.sendFile(path.join(buildDir, 'index.html'))
// })

// // Listen on the port Cloud Run gives us (or 8080 locally)
// const port = process.env.PORT || 8080
// app.listen(port, () => {
//   console.log(`🚀 Listening on port ${port}`)
// })
