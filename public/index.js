let socket = io()
const flexContainer = document.querySelectorAll('.flex-container')[0]



socket.on('allIssues', (issueData) => {
    //issueData = JSON.parse(issueData)
    console.log('hi')
    console.log(issueData)
    issueData.forEach((issue) => {
        const issueDiv = document.createElement('div')
        issueDiv.classList.add('flex-item')
        const header = document.createElement('h2')
        header.textContent = issue.title
        issueDiv.appendChild(header)
        flexContainer.appendChild(issueDiv)
        
        
    })
})