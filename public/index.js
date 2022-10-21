
const flexContainer = document.querySelector('#issues-data-container')
const pageNumberContainer = document.querySelector('#pagination-number-container')
const nextButton = document.querySelector('#next-page')
const previousButton = document.querySelector('#previous-page')


const pageLimit = 8
let issuesData 
let totalPages
let currentPageNumber =1

/*nextButton.addEventListener('click', () =>{
    console.log('next button')
    //currentPageNumber++
    //setCurrentPage(currentPageNumber)
})*/

document.addEventListener('DOMContentLoaded', () => {
    console.log('window')
})
let socket = io()

socket.on('allIssues', (data) => {
    //issueData = JSON.parse(issueData)
    issuesData = data
    
    totalPages = Math.ceil(issuesData.length / pageLimit)
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
    setCurrentPage(1)
   // console.log(nextButton)
   // nextButton.addEventListener('click', () => {console.log('hiiiiiiiiiiiii')})
    
    
})

previousButton.addEventListener('click', () => {
    currentPageNumber--
    setCurrentPage(currentPageNumber)
    console.log('hekkkkkkkkkkkkkkkkkkk')
    console.log(currentPageNumber)
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
    console.log(num)
    Array.from(document.querySelectorAll('.page-number')).forEach(pageNumber =>{
        console.log(pageNumber)
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
       console.log('nextButtonStatus')
    }
    else {
        enablebutton(nextButton)
    }
   //else {console.log('not next status')}
   
}

const previousButtonStatus = () => {
    console.log(document.querySelectorAll('.page-number')[0])
    if(document.querySelectorAll('.page-number')[0].classList.contains('active')){
        disableButton(previousButton)
        console.log('Previous status')
    } 
    else {
        enablebutton(previousButton)
        console.log('Previous status not')
    }
}


const showCurrentPage = () => {
    const visiblePageStartIndex = (currentPageNumber-1) * pageLimit 
    const visiblePageEndIndex = currentPageNumber * pageLimit -1
    const issueDivs = Array.from(document.querySelectorAll('.flex-item'))
    issueDivs.forEach((issueDiv,index) => {
        if(issueDivs.indexOf(issueDiv) >= visiblePageStartIndex && issueDivs.indexOf(issueDiv) < visiblePageEndIndex){
            
            issueDiv.classList.remove('hidden')
        }
        else{
            issueDiv.classList.add('hidden')
        }
    })
    
}

const disableButton = (button) => {
    console.log('it pressed')
    button.classList.add('disabled')
    button.setAttribute('disabled', true)
}

const enablebutton = (button) => {
    button.classList.remove('disabled')
    button.removeAttribute('disabled')
}

nextButton.addEventListener('click', () => {
    currentPageNumber++
    setCurrentPage(currentPageNumber)
    console.log('current page number after next', currentPageNumber)
})