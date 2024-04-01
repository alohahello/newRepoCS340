const utilities = require("../utilities/") //imports an index.js file 
const baseController = {} //creates an empty object named baseController

baseController.buildHome = async function(req, res){
  try {
    const nav = await utilities.getNav()
    // req.flash("notice", "This is a flash message.")
    res.render("index", {title: "Home", nav})
  } catch (error) {
    console.error("getInventoryItemDetail error " + error);
    // Handle the error and send an appropriate response
    res.status(500).send("Internal Server Error");
  }
};

module.exports = baseController //exports the baseController object for use elsewhere.