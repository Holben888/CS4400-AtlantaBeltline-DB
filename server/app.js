const express = require('express')
const store = require('store')
const api = require('./routes')

const app = express()
const port = 3001
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use('/', api)

app.get('/test', (req, res, err) => {
  res.status(200)
  res.send({ response: 'App is running!' })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
