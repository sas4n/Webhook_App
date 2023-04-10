const express = require('express')
const http = require('http')
require('dotenv').config()
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const {engine} = require('express-handlebars')
const {join} = require('path')
const {postFromGitlab} = require('./controllers/webHookController')


app.engine('.hbs', engine({
    extname: '.hbs',
    partialsDir: join(__dirname, 'views', 'partials'),
    defaultLayout: join(__dirname, 'views', 'layout', 'default'),
    helpers:{
        forEach: (times, options) => {
            let pages= ''
            for(let i = 1; i <= times; i++) {
                pages += options.fn({index:i})
            }
            return pages
        },
    }
}))


app.set('view engine', '.hbs')
app.set('views', join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(express.static(join(__dirname, 'public')))

app.use('/issues', require('./routes/issuesRouter'))

io.on('connection', async(socket) => {
    console.log('user connected')
    //app.use('/gitlab', require('./routes/webHookRouter'))
    postFromGitlab(io,app)
})

server.listen(3000, () =>{
    console.log('listening on port 3000')
})