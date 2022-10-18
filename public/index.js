let socket = io()
const flexContainer = document.querySelectorAll('.flex-container')[0]



socket.on('allIssues', (issueData) => {
    issueData.forEach((issue) => {
        const issueDiv = document.createElement('div')
        issueDiv.classList.add('flex-item')
        flexContainer.appendChild(issueDiv)
    })
})