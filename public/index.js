let socket = io()
const flexContainer = document.querySelector('#issues-data-container')
const pageNumberContainer = document.querySelector('#pagination-number-container')
const nextButton = document.querySelector('')
let issuesData 



socket.on('allIssues', (data) => {
    //issueData = JSON.parse(issueData)
    issuesData = data
    const pageLimit = 8
    const totalPages = Math.ceil(issuesData.length / pageLimit)
    console.log('hi')
    console.log(issuesData)
    issuesData.forEach((issue) => {
        const issueDiv = document.createElement('div')
        issueDiv.classList.add('flex-item')
        const header = document.createElement('h4')
        header.textContent = issue.title
        issueDiv.appendChild(header)
        flexContainer.appendChild(issueDiv)
        
        
    })
    handlePageNumber(totalPages)
})

const handlePageNumber = (totalPages) => {
    for(let i = 1; i <= totalPages; i++){
        const pageNumberDiv = document.createElement('div')
        pageNumberDiv.classList.add('page-number')
        pageNumberDiv.textContent= i
        pageNumberDiv.setAttribute('data-page-number', i)
        pageNumberContainer.appendChild(pageNumberDiv)
        pageNumberDiv.addEventListener('click', (e) => pageNumberPressedHandler(e))
    }
}


const setCurrentPage = (index) => {

}

const pageNumberPressedHandler = (e)=> {
    console.log(e.target.dataset.pageNumber)
    const paginationNumberDivs = Array.from(document.querySelectorAll('.page-number'))
    paginationNumberDivs.forEach(pageNumber => {
        pageNumber.classList.remove('active')
    })
    e.target.classList.add('active')
    
}

const showCurrentPage = () => {

}