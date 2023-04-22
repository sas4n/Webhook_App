/**
 *Render the home page.

 * @param {object} req request from client.
 * @param {object} res respond to the client.
 */
const homeHandler = (req, res) => {
  res.render('home')
}

module.exports = {
  homeHandler
}
