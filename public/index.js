
const issuesContainer = document.querySelector('#issues-data-container')
const pageNumberContainer = document.querySelector('#pagination-number-container')
const nextButton = document.querySelector('#next-page')
const previousButton = document.querySelector('#previous-page')

const issueDataTemplate = document.querySelector('#issue-box-template')
const dueDateTemplate = document.querySelector('#due-date-template')

const pageLimit = 4
let issuesData 
let totalPages
let currentPageNumber = 1


let socket = io()

socket.on('allIssues', (data) => {
    //issueData = JSON.parse(issueData)
    issuesData = data
    totalPages = Math.ceil(issuesData.length / pageLimit)
    //console.log('hi')
    console.log(issuesData)
    issuesData.forEach((issue) => {
        const issueBody = issueDataTemplate.content.cloneNode(true)
        //console.log(issueBody.innerHTML)
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
        createdAt.textContent = issue.created_at
        issue.state === 'closed' ? closedAt.textContent = issue.closed_at : closedAt.textContent='_',
        state.textContent = issue.state
        issue.state === 'opened' ? state.classList.add('opened') : state.classList.remove('opened')
        issue.due_date ? (dueDate.textContent=issue.due_date) : ''
        issue.closed_by ? (closedBy.textContent=issue.closed_by) : ''
        upvotes.textContent = issue.upvotes
        downvotes.textContent = issue.downvotes
        issuesContainer.appendChild(issueBody)
        //const header = document.querySelector('h4')
        
        //const description = document.createElement
       
        
        
        
    })
    
    handlePageNumber(totalPages)
    setCurrentPage(1)
    
    
})

socket.on('issueUpdated', (issue) => {
    console.log('webhook')
    console.log(issue)
})

previousButton.addEventListener('click', () => {
    currentPageNumber--
    setCurrentPage(currentPageNumber)
})

nextButton.addEventListener('click', () => {
    currentPageNumber++
    setCurrentPage(currentPageNumber)
})


const handlePageNumber = (totalPages) => {
    for(let i = 1; i <= totalPages; i++){
        const pageNumberDiv = document.createElement('div')
        pageNumberDiv.classList.add('page-number')
        pageNumberDiv.textContent= i
        pageNumberDiv.setAttribute('data-page-number', i)
        pageNumberContainer.appendChild(pageNumberDiv)
        pageNumberDiv.addEventListener('click', () => pageNumberPressedHandler(i))
    }
   
}


const setCurrentPage = (num) => {
    currentPageNumber = num
    Array.from(document.querySelectorAll('.page-number')).forEach(pageNumber =>{
        if(pageNumber.dataset.pageNumber == num){
            pageNumber.classList.add('active')
        }else{
            pageNumber.classList.remove('active')
        }
    })
    nextButtonStatus()
    previousButtonStatus()
    showCurrentPage()
}

const pageNumberPressedHandler = (index)=> {
   // console.log(e.target.dataset.pageNumber)
    /*const paginationNumberDivs = Array.from(document.querySelectorAll('.page-number'))
    paginationNumberDivs.forEach(pageNumber => {
        pageNumber.classList.remove('active')
    })
    e.target.classList.add('active')
    nextButtonStatus()
    previousButtonStatus()*/
    setCurrentPage(index)
    
}

const nextButtonStatus = () => {
    if(document.querySelectorAll('.page-number')[totalPages-1].classList.contains('active')) {
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
        else{
            issueDiv.classList.add('hidden')
        }
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