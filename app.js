const express = require('express')
const http = require('http')
const axios = require('axios')
require('dotenv').config()
const app = express()
const path = require('path')
const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', async(socket) => {
    console.log('user connected')
    const allIssuesData = await fethAllData()
    socket.emit('fetchAllData', allIssuesData)



    app.post('/gitlab', async(req, res) => {
        console.log('post')
        if(req.headers['x-gitlab-token'] === process.env.GITLAB_SECRET_KEY){
            console.log('post from gitlab')
            const {body} = req
            //console.log(body)
        const issue = {
            event_type : body.event_type,
            owner_name : body.user.name,
            repository_name : body.repository.name,
            project_description : body.project.description,
            issue_description : body.object_attributes.description,
            created_at : body.object_attributes.created_at,
            title: body.object_attributes.title,
            updated_at: body.object_attributes.updated_at,
            state: body.object_attributes.state,
            assignees: body.assignees ? body.assignees.map(assignee => ({username: assignee.username})): null,
            labels: body.labels ? body.labels.map(label => ({name: label.name})): null
        }
        io.emit('issueUpdated', issue)
        
        res.status(201)
        
        res.send()
        }else{
            console.log('not from gitlab')
            res.status(403).json({error: new Error('You are not Authorized')})
        }

        //res.set('Authorization', `Bearer ${process.env.GITLAB_ACCESS_TOKEN}`)
        
    })
    socket.on('getAllDataAfterAnIssueUpdated', async() => {
        console.log('it gets event fetch data from client')
        const allIssuesData = await fethAllData()
        io.emit('fetchAllData',allIssuesData) 
    })

    socket.on('fetchIssueById', async(iid) => {
        console.log(iid)
        const issueData = await fetchIssueById(iid)
        socket.emit('IssueDataFromServer', issueData)
         
    })
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

const fethAllData = async() => {
    const config = {
        headers:{Authorization:` Bearer ${process.env.GITLAB_ACCESS_TOKEN}`}
    }
    const {data, headers} = await axios.get(process.env.GITLAB_URL_FETCH_ALL_ISSUES, config)
    //data.forEach(issue => console.log(issue))
    const allIssuesData = data.map(issue => extractRequiredData(issue))
    return allIssuesData
}

const fetchIssueById = async(iid) => {
    const config = {
        headers:{
            Authorization:` Bearer ${process.env.GITLAB_ACCESS_TOKEN}`
        }
    }
    console.log(process.env.GITLAB_URL_FETCH_ISSUE_BY_ID+iid)
    const {data} = await axios.get(process.env.GITLAB_URL_FETCH_ISSUE_BY_ID+iid, config)
    console.log(data)
    const issueData = extractRequiredData(data)
    return issueData
    //console.log(issueData)
}

const extractRequiredData = (issue) => ({
    id: issue.id,
    iid: issue.iid,
    project_id: issue.project_id,
    title: issue.title,
    description : issue.description,
    state: issue.state,
    created_at: issue.created_at,
    closed_at: issue.closed_at,
    labels: issue.labels,
    closed_by: issue.closed_By ? issue.closed_By.name: null,// it s a bug, closed_by is undefined somehow
    labels: issue.labels,
    assignees: issue.assignees.map((assignee) => ({assignee_userName: assignee.username})),
    author_name: issue.author.name,
    type: issue.type,
    assignee: issue.assignee ? issue.assignee.name : null,
    upvotes: issue.upvotes,
    downvotes: issue.downvotes,
    due_date: issue.due_date,
    web_url: issue.web_url,
    updated_at: issue.updated_at,
    milestone: issue.milestone ? {
        title: issue.milestone.title,
        due_date: issue.milestone.due_date,
        state: issue.milestone.state
    }:null
})

server.listen(3000, () =>{
    console.log('listening on port 3000')
})