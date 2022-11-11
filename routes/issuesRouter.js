const router = require('express').Router()
const {gettAllIssues} = require('../controllers/issuesController')
router.get('/all-issues', gettAllIssues)

router.get('/issue/:iid', (req, res) => {

})

module.exports = router