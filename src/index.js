const { Client } = require('pg')
const express = require('express')
const app = express()

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV != 'production' ? false : {
    rejectUnauthorized: false
  }
})

console.log('Connecting to database...')
client.connect().then(() => {
  console.log('Database connected!')
})

const PORT = process.env.PORT || 8080

app.use(express.json())

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', async (req, res) => {
  const { rows } = await client.query('SELECT * FROM Users')
  res.send(rows)
})

app.delete('/users', async (req, res) => {
  if (!req.body.id) {
    res.status(400).send('Missing id')
    return
  }

  const query = 'DELETE FROM Users WHERE id = $1'
  await client.query(query, [req.body.id])
  res.send('User deleted')
})

app.post('/users', async (req, res) => {
  if(!req.body.name) {
    res.status(400).send('Name is required')
    return
  }

  const query = 'INSERT INTO Users (name) VALUES ($1) RETURNING *'
  const { rows } = await client.query(
    query,
    [req.body.name]
  )
  res.json(rows[0])
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})