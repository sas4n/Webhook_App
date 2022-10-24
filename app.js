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

io.on('connection', async(socket) => {
    console.log('user connected')
    const config = {
        headers:{
            Authorization:` Bearer ${process.env.GITLAB_ACCESS_TOKEN}`
        }
    }
    const {data} = await axios.get(process.env.GITLAB_URL, config)
    console.log(data)
    const allIssuesData = data.map(issue => ({
        id: issue.id,
        project_id : issue.project_id,
        title : issue.title,
        description : issue.description,
        state: issue.state,
        closed_by : issue.closed_By ? issue.closed_By.name: null,
        labels: issue.labels,
        assignees: issue.assignees.map((assignee) => ({assignee_userName: assignee.username})),
        author_name: issue.author.name,
        type: issue.type,
        assignee : issue.assignee ? issue.assignee.name : null,
        upvotes: issue.upvotes,
        downvotes: issue.downvotes,
        due_date: issue.due_date,
        web_url: issue.web_url,
        project_url: issue.project,

    }))
    socket.emit('allIssues', allIssuesData)

} 
    
    )

/*app.get('/', async(req, res) => {
    console.log('get is called')
    //res.set('PRIVATE-TOKEN', process.env.GITLAB_ACCESS_TOKEN)
    const config = {
        headers:{Authorization:` Bearer ${process.env.GITLAB_ACCESS_TOKEN}`  }
    }
     const {data} = await axios.get(process.env.GITLAB_URL, config)
    const allIssuesData = data.map(issue => ({
        id: issue.id,
        project_id : issue.project_id,
        title : issue.title,
        description : issue.description,
        state: issue.state,
        closed_by : issue.closed_By ? issue.closed_By.name: null,
        labels: issue.labels,
        assignees: issue.assignees.map((assignee) => ({assignee_userName: assignee.username})),
        author_name: issue.author.name,
        type: issue.type,
        assignee : issue.assignee ? issue.assignee.name : null,
        upvotes: issue.upvotes,
        downvotes: issue.downvotes,
        due_date: issue.due_date,
        web_url: issue.web_url,
        project_url: issue.project,

    }))
    res.send(allIssuesData)
   // axios.get(process.env.GITLAB_URL, config).then((response) => {res.send(response.data)}).catch((error) => {console.log(error)})
   // res.send() kj

})*/

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