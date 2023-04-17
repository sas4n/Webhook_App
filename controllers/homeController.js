const homeHandler = (req, res) => {
    console.log('Home Handler')
    res.render('home')
}

module.exports = {
    homeHandler
}