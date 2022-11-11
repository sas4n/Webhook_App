require('dotenv').config()
const axios = require('axios')

const gettAllIssues = async(req, res, next) => {
    const allIssuesData = await fethAllData()
   // console.log(allIssuesData.length)
    res.render('issues/allIssues', { allIssuesData , totalPages : Math.ceil(allIssuesData.length/4)})
}

const fethAllData = async() => {
    const config = {
        headers:{Authorization:` Bearer ${process.env.GITLAB_ACCESS_TOKEN}`}
    }
    const {data, headers} = await axios.get(process.env.GITLAB_URL_FETCH_ALL_ISSUES, config)
    //data.forEach(issue => console.log(issue))
    const allIssuesData = data.map(issue => extractRequiredData(issue))
    return allIssuesData
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

module.exports = {
    gettAllIssues
}