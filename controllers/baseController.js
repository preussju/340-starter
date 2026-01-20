//A controller is the location where the logic of the application resides

const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController