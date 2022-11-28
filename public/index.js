dayjs.extend(window.dayjs_plugin_relativeTime)
const issuesContainer = document.querySelector('#issues-data-container')
const pageNumberContainer = document.querySelector('#pagination-number-container')
const nextButton = document.querySelector('#next-page')
const previousButton = document.querySelector('#previous-page')
const notificationBtn = document.querySelector('#notification-btn')
const notificaionBody = document.querySelector('#notification-body')
const homeButton = document.querySelector('#home-button')

const issueDataTemplate = document.querySelector('#issue-box-template')
const notificationTemplate = document.querySelector('#notification-template')

const pageLimit = 4
let totalPages
let currentPageNumber = 1


let socket = io()

document.addEventListener('DOMContentLoaded', () => {
    if(document.title === 'All Issues') {
        setCurrentPage(1)
        previousButton.addEventListener('click', () => {
            console.log('previous btn')
            currentPageNumber--
            setCurrentPage(currentPageNumber)
        })
        
        nextButton.addEventListener('click', () => {
            currentPageNumber++
            setCurrentPage(currentPageNumber)
        })
    }
    //
    const comments = Array.from(document.querySelectorAll('.comments'))
    //console.log(comments)
    comments.forEach(comment => {
       // console.log(comment.textContent)
       //convert string containing html elements to html elements
       const commentConvertedToHtml = new DOMParser().parseFromString(comment.textContent,'text/html').documentElement
       console.log(commentConvertedToHtml)
       comment.replaceChildren()
       comment.appendChild(commentConvertedToHtml)
      //comment.innerHTML=commentConvertedToHtml
        //comment.innerHTML = new DOMParser().parseFromString(comment.textContent,'text/html').body.innerHTML
       // comment.innerHTML = marked.parse(comment.innerHTML)
       // console.log(comment)
    })

})
/*socket.on('allIssuesDataFromServer', (data) => {
    //First we remove everything from before to prevent adding all issue boxes again to current boxes
    issuesContainer.replaceChildren()
    pageNumberContainer.replaceChildren()
    totalPages = Math.ceil(data.length / pageLimit)
    data.forEach(issue => prepareIssueBox(issue))
    notificationUpdateHandler(data)
    handlePageNumber(totalPages)
    setCurrentPage(1) 
})*/

/*socket.on('issueUpdated', (issue) => {
    const notification = createNewNotification(issue)
    notificaionBody.prepend(notification)
    notificationBtn.classList.add('new-notification')
    socket.emit('fetchAllIssuesData')
})

socket.on('issueDataFromServer', (data) => {
    console.log(data)
})*/

homeButton.addEventListener('click', () => {
    console.log('home button clicked')
    socket.emit('fetchAllIssuesData')
})



notificationBtn.addEventListener('click', () => {
    notificaionBody.classList.toggle('hidden')
    notificationBtn.classList.remove('new-notification')
})

/*const handlePageNumber = (totalPages) => {
    for(let i = 1; i <= totalPages; i++){
        const pageNumberDiv = document.createElement('div')
        pageNumberDiv.classList.add('page-number')
        pageNumberDiv.textContent= i
        pageNumberDiv.setAttribute('data-page-number', i)
        pageNumberContainer.appendChild(pageNumberDiv)
        pageNumberDiv.addEventListener('click', () => setCurrentPage(i))
    }
}*/

const allPageNumbers = Array.from(document.querySelectorAll('.page-number'))
allPageNumbers.forEach((pageNumber, index) => pageNumber.addEventListener('click', () => setCurrentPage(index+1)));



const setCurrentPage = (num) => {
    currentPageNumber = num
    allPageNumbers.forEach(pageNumber =>{
        if(pageNumber.textContent == num){
            pageNumber.classList.add('active')
        }else{
            pageNumber.classList.remove('active')
        }
    })
    nextButtonStatus()
    previousButtonStatus()
    showCurrentPage()
}

const notificationUpdateHandler = (issues) => {
    //first sort the array based on the date, so we have the newest notification on top
    issues.sort((a, b) => {
        return a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0
    })
    issues.forEach((issue) => {
        const notification = createNewNotification(issue)
        notificaionBody.appendChild(notification)
    })
}

const allNotifications = Array.from(document.querySelectorAll('.notification'))
allNotifications.forEach((notification) => notification.addEventListener('click', (e) => console.log(e.target.id)))

const createNewNotification = (issue) => {
    const notificationBox = notificationTemplate.content.cloneNode(true)
    const notification = notificationBox.querySelector('#notification')
    notification.addEventListener('click', () => fetchIssueDetails(issue))
    notification.textContent = ``
    return notification
}

const fetchIssueDetails = (issue) => {
    socket.emit('fetchIssueById', issue.iid)
}

const nextButtonStatus = () => {
    const lastPageIndex = document.querySelectorAll('.page-number').length -1
    //to check if we are currently seeing the last page
    if(document.querySelectorAll('.page-number')[lastPageIndex].classList.contains('active')) {
        disableButton(nextButton)
    }
    else { enablebutton(nextButton)}
   
}

const previousButtonStatus = () => {
    if(document.querySelectorAll('.page-number')[0].classList.contains('active')){
        disableButton(previousButton)
    } 
    else { enablebutton(previousButton)}
}

const showCurrentPage = () => {
    const visiblePageStartIndex = (currentPageNumber-1) * pageLimit 
    const visiblePageEndIndex = currentPageNumber * pageLimit -1
    const issueDivs = Array.from(document.querySelectorAll('.issue-box'))
    issueDivs.forEach((issueDiv,index) => {
        if(index >= visiblePageStartIndex && index <= visiblePageEndIndex){
            issueDiv.classList.remove('hidden')
        }
        else{issueDiv.classList.add('hidden')}
    })  
}

const disableButton = (button) => {
    button.classList.add('disabled')
    button.setAttribute('disabled', true)
}

const enablebutton = (button) => {
    button.classList.remove('disabled')
    button.removeAttribute('disabled')
}

const prepareIssueBox = (issue) => {
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
    
    header.textContent = issue.title
    description.value = issue.description
    author.textContent = issue.author_name
    issue.labels.forEach(label => {labels.textContent += label + ' ' } )
    issue.assignees.forEach(assignee => assignees.textContent += assignee.assignee_userName + ', ')
    createdAt.textContent = new Date(issue.created_at).toLocaleString()
    issue.state === 'closed' ? closedAt.textContent = new Date(issue.closed_at).toLocaleString() : closedAt.textContent='_',
    state.textContent = issue.state
    issue.state === 'opened' ? state.classList.add('opened') : state.classList.remove('opened')
    issue.due_date ? (dueDate.textContent=issue.due_date) : ''
    issue.closed_by ? (closedBy.textContent=issue.closed_by) : ''
    upvotes.textContent = issue.upvotes
    downvotes.textContent = issue.downvotes
    issuesContainer.appendChild(issueBody)
}