const express = require('express')
const http = require('http')
const axios = require('axios')
require('dotenv').config()
const app = express()
const path = require('path')
const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(express.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    console.log('get is called')
    //res.set('PRIVATE-TOKEN', process.env.GITLAB_ACCESS_TOKEN)
    const config = {
        headers:{Authorization:` Bearer ${process.env.GITLAB_ACCESS_TOKEN}`  }
    }
    axios.get(process.env.GITLAB_URL, config).then((response) => {res.send(response.data)}).catch((error) => {console.log(error)})
   // res.send() kj

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