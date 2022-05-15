const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')

const port = 3000
const app = express()

const dbversion = {
  dbversion: new Date().toString(),
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.post('/dbversion', (_, res) => {
  dbversion.dbversion = new Date().toString()
  res.json(dbversion)
})

app.get('/dbversion', (_, res) => res.send(dbversion))

app.get('/', (_, res) => res.render('index', dbversion))

app.listen(port, () => {
  console.log(chalk.bgGreen(`🚀 Running at http://localhost:${port}`))
})
