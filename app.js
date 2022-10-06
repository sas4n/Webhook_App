const express = require('express')
const http = require('http')
require('dotenv').config()
const app = express()
const path = require('path')
const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(express.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.send('hi')
})

app.post('/gitlab', (req, res) => {
    console.log(req.headers)
    console.log(req.body)
    console.log(process.env.GITLAB_ACCESS_TOKEN)
    res.set('Authorization', process.env.GITLAB_ACCESS_TOKEN)
    res.status(201)
    
    res.send()
})

server.listen(3000, () =>{
    console.log('listening on port 3000')
})