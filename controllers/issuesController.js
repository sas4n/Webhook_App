require('dotenv').config()
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const axios = require('axios')
const marked = require('marked')

/**
 * Get data of all issues from Gitlab and render the relevant page.
 *
 * @param {object} req request object.
 * @param {object} res Response object.
 * @param {Function} next A callback function required by middleware to call the next function.
 */
const gettAllIssues = async (req, res, next) => {
  const allIssuesData = await fethAllDataFromGitlab()
  const notificationData = allIssuesData.map(issue => ({
    title: issue.title,
    updated_at: issue.updated_at,
    updated_from_now: dayjs(issue.updated_at).fromNow(),
    id: issue.id,
    iid: issue.iid
  }))
  // we do this, since we need to sort it based on updated-date, but we dont want to sort all data, otherwise, they will be shown based on their update date.
  notificationData.sort((a, b) => {
    return a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0
  })
  res.render('issues/allIssues', {
    allIssuesData,
    totalPages: Math.ceil(allIssuesData.length / 4),
    title: 'All Issues',
    notificationData
  })
}

/**
 * Get the the selected issue and render the relevant page.
 *
 * @param {object} req request object.
 * @param {object} res response object.
 * @param {Function} next A callback function required by middleware to call the next function.
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
  res.render('issues/issue', {
    issueData,
    title: 'Issue',
    commentsData
  })
}

/**
 * Get all issues data from Fitlab.
 */
const fethAllDataFromGitlab = async () => {
  const config = {
    headers: { Authorization: ` Bearer ${process.env.GITLAB_ACCESS_TOKEN}` }
  }
  const { data } = await axios.get(process.env.GITLAB_URL_FETCH_ALL_ISSUES, config)
  const allIssuesData = data.map(issue => extractRequiredData(issue))
  return allIssuesData
}

/**
 * Get data of the selected issue from Gitlab and extract the required data.
 *
 * @param {string} issueIid Iid of the issue.
 */
const fetchIssueByIdFromGitlab = async (issueIid) => {
  const config = {
    headers: { Authorization: ` Bearer ${process.env.GITLAB_ACCESS_TOKEN}` }
  }
  const { data } = await axios.get(process.env.GITLAB_URL_FETCH_ISSUE_BY_ID + issueIid, config)
  const issueData = extractRequiredData(data)
  return issueData
}

/**
 * Extract the required data from an issue's data.
 *
 * @param {object} issue Issue object.
 * @returns {object} Required issue data.
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
 * Fetch all comments and other activities of an issue.
 *
 * @param {string} issueIid Iid of an issue.
 */
const fetchAllCommentsOfAnIssue = async (issueIid) => {
  const config = {
    headers: { Authorization: ` Bearer ${process.env.GITLAB_ACCESS_TOKEN}` }
  }
  const GITLAB_URL_FETCH_ALL_COMMENTS_OF_AN_ISSUE = process.env.GITLAB_URL_FETCH_ISSUE_BY_ID + issueIid + '/notes'
  const { data } = await axios.get(GITLAB_URL_FETCH_ALL_COMMENTS_OF_AN_ISSUE, config)
  return data
}

module.exports = {
  gettAllIssues, getIssueById
}
