// eslint-disable-next-line no-undef
dayjs.extend(window.dayjs_plugin_relativeTime)
const issuesContainer = document.querySelector('#issues-data-container')
const nextButton = document.querySelector('#next-page')
const previousButton = document.querySelector('#previous-page')
const notificationBtn = document.querySelector('#notification-btn')
const notificaionBody = document.querySelector('#notification-body')
const homeButton = document.querySelector('#home-button')
const commentsContainer = document.querySelector('.comments-container')
let comment
if (commentsContainer) {
  comment = commentsContainer.firstElementChild.cloneNode(true)
}
const issueDataTemplate = document.querySelector('#issue-box-template')
const pageLimit = 4
let currentPageNumber = 1

// eslint-disable-next-line no-undef
const socket = io()

document.addEventListener('DOMContentLoaded', () => {
  if (document.title === 'All Issues') {
    setCurrentPage(1)
    previousButton.addEventListener('click', () => {
      currentPageNumber--
      setCurrentPage(currentPageNumber)
    })
    nextButton.addEventListener('click', () => {
      currentPageNumber++
      setCurrentPage(currentPageNumber)
    })
  }
  notificationButtonVissiblityHandler(document.title)
  const comments = Array.from(document.querySelectorAll('.comments'))
  comments.forEach(comment => {
    // convert string containing html elements to html elements
    const p = document.createElement('p')
    p.innerHTML = comment.textContent
    // const commentConvertedToHtml = new DOMParser().parseFromString(comment.textContent,'text/html').documentElement
    comment.replaceChildren()
    comment.appendChild(p.firstElementChild)
  })
})

socket.on('issueUpdated', (issue) => {
  const notification = document.createElement('div')
  notification.classList.add('notification')
  const anchor = document.createElement('a')
  anchor.classList.add('notification-link')
  anchor.href = `/issues/issue/${issue.iid}`
  anchor.textContent = `Issue ${issue.title} was updated ${issue.updated_from_now}`
  notification.appendChild(anchor)
  notificaionBody.prepend(notification)
  notificationBtn.classList.add('new-notification')
  updateIssueBox(issue)
  // socket.emit('fetchAllIssuesData')
})

homeButton.addEventListener('click', () => {
  window.location.href = 'http://localhost:3000/issues/all-issues'
})

notificationBtn.addEventListener('click', () => {
  notificaionBody.classList.toggle('hidden')
  notificationBtn.classList.remove('new-notification')
})

/* const handlePageNumber = (totalPages) => {
    for(let i = 1; i <= totalPages; i++){
        const pageNumberDiv = document.createElement('div')
        pageNumberDiv.classList.add('page-number')
        pageNumberDiv.textContent= i
        pageNumberDiv.setAttribute('data-page-number', i)
        pageNumberContainer.appendChild(pageNumberDiv)
        pageNumberDiv.addEventListener('click', () => setCurrentPage(i))
    }
} */

const allPageNumbers = Array.from(document.querySelectorAll('.page-number'))
allPageNumbers.forEach((pageNumber, index) => pageNumber.addEventListener('click', () => setCurrentPage(index + 1)))

/**
 * Change the visibility of the notification btn relevantly.
 *
 * @param {string} documentTitle Title the current page.
 */
const notificationButtonVissiblityHandler = (documentTitle) => {
  documentTitle !== 'All Issues' ? notificationBtn.classList.add('hidden') : notificationBtn.classList.remove('hidden')
}

/**
 * Set the current page and based on that show the current page.
 *
 * @param {number} num number of the page.
 */
const setCurrentPage = (num) => {
  currentPageNumber = num
  allPageNumbers.forEach(pageNumber => {
    // eslint-disable-next-line eqeqeq
    if (pageNumber.textContent == num) { // I used == instead of ===, as pagenumber.textContent is a string.
      pageNumber.classList.add('active')
    } else {
      pageNumber.classList.remove('active')
    }
  })
  nextButtonStatus()
  previousButtonStatus()
  showCurrentPage()
}

/**
 * It deceides if a next button should be disabled or not.
 */
const nextButtonStatus = () => {
  const lastPageIndex = document.querySelectorAll('.page-number').length - 1
  // to check if we are currently seeing the last page
  if (document.querySelectorAll('.page-number')[lastPageIndex].classList.contains('active')) {
    disableButton(nextButton)
  } else { enablebutton(nextButton) }
}

/**
 * It decides if the previous button shold be disbled or not.
 */
const previousButtonStatus = () => {
  if (document.querySelectorAll('.page-number')[0].classList.contains('active')) {
    disableButton(previousButton)
  } else { enablebutton(previousButton) }
}

/**
 * Make the selected page visible.
 */
const showCurrentPage = () => {
  const visiblePageStartIndex = (currentPageNumber - 1) * pageLimit
  const visiblePageEndIndex = currentPageNumber * pageLimit - 1
  const issueDivs = Array.from(document.querySelectorAll('.issue-box'))
  issueDivs.forEach((issueDiv, index) => {
    if (index >= visiblePageStartIndex && index <= visiblePageEndIndex) {
      issueDiv.classList.remove('hidden')
    } else { issueDiv.classList.add('hidden') }
  })
}

/**
 * Disable a button.
 *
 * @param {HTMLElement} button The button to disable.
 */
const disableButton = (button) => {
  button.classList.add('disabled')
  button.setAttribute('disabled', true)
}

/**
 * Enable a button.
 *
 * @param {HTMLElement} button The button to enable.
 */
const enablebutton = (button) => {
  button.classList.remove('disabled')
  button.removeAttribute('disabled')
}

/**
 * Update the relevant issue box after an issue updated.
 *
 * @param {object} issue The information of updated issue.
 */
const updateIssueBox = (issue) => {
  const prvUpvote = document.querySelector('#issue-upvote')
  const prvDownvote = document.querySelector('#issue-downvote')
  const issueBody = issueDataTemplate.content.cloneNode(true)
  const issueBox = issueBody.querySelector('.issue-box')
  const header = issueBody.querySelector('#issue-title')
  const description = issueBody.querySelector('textarea')
  const author = issueBody.querySelector('#issue-author')
  const assignees = issueBody.querySelector('#issue-assignees')
  const labels = issueBody.querySelector('#issue-labels')
  const createdAt = issueBody.querySelector('#issue-created-at')
  const closedAt = issueBody.querySelector('#issue-closed-at')
  const state = issueBody.querySelector('#issue-state')
  const closedBy = issueBody.querySelector('#issue-closed-by')
  const dueDate = issueBody.querySelector('#issue-due-date')
  const upvotes = issueBody.querySelector('#issue-upvote')
  const downvotes = issueBody.querySelector('#issue-downvote')
  const issueToBeUpdated = document.querySelector(`#issue-box-${issue.iid}`)
  if (issueBox.hasAttribute('id')) {
    issueBox.classList.remove('issue-box')
    issueBox.classList.add('single-issue-box')
  }
  if (commentsContainer) {
    const commentsContainerToBeReplaced = issueBody.querySelector('.comments-container')
    comment.innerHTML = `<p>${issue.added_comment}</p>`
    commentsContainer.prepend(comment)
    commentsContainerToBeReplaced.innerHTML = commentsContainer.innerHTML
    // commentsContainerToBeReplaced.appendChild(commentsContainer)
  }

  issueBox.id = `issue-box-${issue.iid}`
  header.textContent = issue.title
  description.value = issue.issue_description
  dueDate.textContent = issue.due_date
  author.innerText = issue.owner_name
  issue.labels.forEach(label => {
    const paragraph = document.createElement('p')
    paragraph.textContent = label.name
    labels.appendChild(paragraph)
  })
  if (issue.assignees) {
    issue.assignees.forEach(assignee => {
      const paragraph = document.createElement('p')
      paragraph.textContent = assignee.username
      assignees.appendChild(paragraph)
    })
  }
  createdAt.textContent = new Date(issue.created_at).toLocaleString()
  closedAt.textContent = new Date(issue.closed_at).toLocaleString()
  issue.state === 'closed' ? closedAt.textContent = new Date(issue.closed_at).toLocaleString() : closedAt.textContent = '_'
  state.textContent = issue.state
  issue.state === 'opened' ? state.classList.add('opened') : state.classList.remove('opened')
  // eslint-disable-next-line no-unused-expressions
  issue.due_date ? (dueDate.textContent = issue.due_date) : ''
  // eslint-disable-next-line no-unused-expressions
  issue.closed_by ? (closedBy.textContent = issue.closed_by) : ''
  upvotes.textContent = prvUpvote.textContent
  downvotes.textContent = prvDownvote.textContent
  issuesContainer.replaceChild(issueBox, issueToBeUpdated)
}

/* const notificationUpdateHandler = (issues) => {
  // first sort the array based on the date, so we have the newest notification on top
  issues.sort((a, b) => {
    return a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0
  })
  issues.forEach((issue) => {
    const notification = createNewNotification(issue)
    notificaionBody.appendChild(notification)
  })
}

const createNewNotification = (issue) => {
  const notificationBox = notificationTemplate.content.cloneNode(true)
  const notification = notificationBox.querySelector('#notification')
  notification.addEventListener('click', () => fetchIssueDetails(issue))
  notification.textContent = ''
  return notification
}
const fetchIssueDetails = (issue) => {
  socket.emit('fetchIssueById', issue.iid)
} */
