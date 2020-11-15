const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const port = process.env.PORT || 3000

var changeController = require('./controllers/change')
var createController = require('./controllers/create')
var deleteController = require('./controllers/delete')
var infoController = require('./controllers/info')
var searchController = require('./controllers/search')
var updateController = require('./controllers/update')
var virtualDeviceController = require('./controllers/virtual_device')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/change', changeController)
app.use('/create', createController)
app.use('/delete', deleteController)
app.use('/info', infoController)
app.use('/search', searchController)
app.use('/change', updateController)
app.use('/', virtualDeviceController)

app.listen(port, () => { console.log('started listening') })