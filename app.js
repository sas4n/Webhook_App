const express = require('express')
const http = require('http')
require('dotenv').config()
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const { engine } = require('express-handlebars')
const { join } = require('path')
const { postFromGitlab } = require('./controllers/webHookController')

const port = process.env.PORT || 3000
app.engine('.hbs', engine({
  extname: '.hbs',
  partialsDir: join(__dirname, 'views', 'partials'),
  defaultLayout: join(__dirname, 'views', 'layout', 'default'),
  helpers: {
    /**
     * A helper method calculating the number of page in the pagination page.
     *
     * @param {number} times Numbers of times that should be looped or the value that should be specifed beside the helper method in handlebars.
     * @param {object} options with help of fn method all value provided as an object inside it could be accessible inside helper method.
     * @returns {number} Number of pages.
     */
    forEach: (times, options) => {
      let pages = ''
      for (let i = 1; i <= times; i++) {
        pages += options.fn({ index: i })
      }
      return pages
    }
  }
}))

app.set('view engine', '.hbs')
app.set('views', join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(join(__dirname, 'public')))

app.use('/', require('./routes/homeRouter'))
app.use('/issues', require('./routes/issuesRouter'))

io.on('connection', async (socket) => {
  console.log('user connected')
  postFromGitlab(io, app)
})

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})
