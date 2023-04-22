const router = require('express').Router()
const { gettAllIssues, getAllCommentsOfAnIssue, getIssueById } = require('../controllers/issuesController')
router.get('/all-issues', gettAllIssues)

router.get('/issue/:iid', getIssueById)

module.exports = router
