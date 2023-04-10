const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const postFromGitlab = (io,app) => {

    console.log('ok')
    app.post('/gitlab', (req, res) => {
        if(req.headers['x-gitlab-token'] === process.env.GITLAB_SECRET_KEY){
            console.log('post from gitlab')
            const {body} = req
            console.log(body)
        const issue = {
            event_type : body.event_type,
            owner_name : body.user.name,
            iid: body.object_attributes.iid,
            repository_name : body.repository.name,
            project_description : body.project.description,
            issue_description : body.object_attributes.description,
            created_at : body.object_attributes.created_at,
            title: body.object_attributes.title ? body.object_attributes.title : body.issue.title ,
            updated_at: body.object_attributes.updated_at,
            closed_at: body.object_attributes.closed_at,
            due_date: body.object_attributes.due_date,
            state: body.object_attributes.state,
            assignees: body.assignees ? body.assignees.map(assignee => ({username: assignee.username})): null,
            labels: body.labels ? body.labels.map(label => ({name: label.title})): null,
            updated_from_now: dayjs(body.object_attributes.updated_at).fromNow()
        }
       // console.log(issue)
       console.log('it workeddddddddd')
        io.emit('issueUpdated', issue)
        
        res.status(201)
        
        res.send()
        }else{
            console.log('not from gitlab')
            res.status(403).json({error: new Error('You are not Authorized')})
        }
    })
   
}

module.exports = {
    postFromGitlab
}