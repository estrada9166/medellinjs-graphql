'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const { makeExecutableSchema } = require('graphql-tools')
const pg = require('pg')

const typeDefs = fs.readFileSync(path.join(__dirname, 'api', 'schema.graphql'), 'utf-8')
const resolvers = require('./api/resolvers')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: 'development.env' })
}

const pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

const app = express()

app.set('port', process.env.PORT || 7000)
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

const schema = makeExecutableSchema({ typeDefs, resolvers })

app.use('/', (req, res) => {
  graphqlHTTP({
    schema,
    graphiql: true,
    context: { pgPool }
  })(req, res)
})

const server = app.listen(app.get('port'), () => {
  console.log(`Server running -> PORT ${server.address().port}`)
})

module.exports = app
