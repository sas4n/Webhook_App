require('dotenv').config()
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const axios = require('axios')
const marked = require('marked')

/**
 *
 * @param req
 * @param res
 * @param next
 */
const gettAllIssues = async (req, res, next) => {
  const allIssuesData = await fethAllDataFromGitlab()
  // we do this, since we need to sort it based on updated-date, but we dont want to sort all data, otherwise, they will be shown based on their update date.
  const notificationData = allIssuesData.map(issue => ({
    title: issue.title,
    updated_at: issue.updated_at,
    updated_from_now: dayjs(issue.updated_at).fromNow(),
    id: issue.id,
    iid: issue.iid
  }))
  notificationData.sort((a, b) => {
    return a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0
  })
  // allIssuesData.forEach(issue => console.log(issue.assignees))
  res.render('issues/allIssues', {
    allIssuesData,
    totalPages: Math.ceil(allIssuesData.length / 4),
    title: 'All Issues',
    notificationData
  })
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
const getIssueById = async (req, res, next) => {
  const { iid } = req.params
  const issueData = await fetchIssueByIdFromGitlab(iid)
  const allComments = await fetchAllCommentsOfAnIssue(iid)
  const commentsData = allComments.map(comment => ({
    id: comment.id,
    body: marked.parse(comment.body),
    created_at: comment.created_at,
    updated_at: comment.updated_at
  }))
  // commentsData.forEach(comment =>console.log(comment.body))
  res.render('issues/issue', {
    issueData,
    title: 'Issue',
    commentsData
  })
}

/* const getAllCommentsOfAnIssue = async (req, res) => {
    const{iid} = req.params
    const allComments = await fetchAllCommentsOfAnIssue(iid)
    const commentsData = allComments.map(comment => ({
        id : comment.id,
        body : marked.parse(comment.body),
        created_at : comment.created_at,
        updated_at : comment.updated_at
    }))
    res.render('issues/issue', {commentsData})
} */

/**
 *
 */
const fethAllDataFromGitlab = async () => {
  const config = {
    headers: { Authorization: ` Bearer ${process.env.GITLAB_ACCESS_TOKEN}` }
  }
  const { data, headers } = await axios.get(process.env.GITLAB_URL_FETCH_ALL_ISSUES, config)
  // data.forEach(issue => console.log(issue))
  const allIssuesData = data.map(issue => extractRequiredData(issue))
  return allIssuesData
}

/**
 *
 * @param issue_iid
 */
const fetchIssueByIdFromGitlab = async (issue_iid) => {
  const config = {
    headers: { Authorization: ` Bearer ${process.env.GITLAB_ACCESS_TOKEN}` }
  }
  const { data, headers } = await axios.get(process.env.GITLAB_URL_FETCH_ISSUE_BY_ID + issue_iid, config)
  const issueData = extractRequiredData(data)
  return issueData
}

/**
 *
 * @param issue
 */
const extractRequiredData = (issue) => ({
  id: issue.id,
  iid: issue.iid,
  project_id: issue.project_id,
  title: issue.title,
  description: issue.description,
  state: issue.state,
  created_at: new Date(issue.created_at).toLocaleString(),
  closed_at: new Date(issue.closed_at).toLocaleString(),
  labels: issue.labels,
  closed_by: issue.closed_By ? issue.closed_By.name : null, // it s a bug, closed_by is undefined somehow
  labels: issue.labels,
  assignees: issue.assignees.map((assignee) => ({ assignee_userName: assignee.username })),
  author_name: issue.author.name,
  type: issue.type,
  assignee: issue.assignee ? issue.assignee.name : null,
  upvotes: issue.upvotes,
  downvotes: issue.downvotes,
  due_date: issue.due_date,
  web_url: issue.web_url,
  updated_at: issue.updated_at,
  milestone: issue.milestone
    ? {
        title: issue.milestone.title,
        due_date: issue.milestone.due_date,
        state: issue.milestone.state
      }
    : null,
  comment: issue.event_type === 'note' ? issue.object_attributes.description : null
})

/**
 *
 * @param issue_iid
 */
const fetchAllCommentsOfAnIssue = async (issue_iid) => {
  const config = {
    headers: { Authorization: ` Bearer ${process.env.GITLAB_ACCESS_TOKEN}` }
  }
  const GITLAB_URL_FETCH_ALL_COMMENTS_OF_AN_ISSUE = process.env.GITLAB_URL_FETCH_ISSUE_BY_ID + issue_iid + '/notes'

  const { data } = await axios.get(GITLAB_URL_FETCH_ALL_COMMENTS_OF_AN_ISSUE, config)
  // data.forEach(comment => console.log(marked.parse(comment.body)))
  return data
}

module.exports = {
  gettAllIssues, getIssueById
}
