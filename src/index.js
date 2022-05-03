const { Client } = require('pg')
const express = require('express')
const app = express()

console.log('Creating db client')

const client = new Client({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgrespassword',
  port: 5432,
})

console.log('indo conecta')

client.connect().then(() => {
  console.log('Conectado')
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