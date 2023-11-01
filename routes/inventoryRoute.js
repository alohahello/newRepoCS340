// Needed Resources 
//brings Express into the scope of the file
const express = require("express") //Express is a fast, un-opinionated, minimalist web framework for Node.js that is used to build web applications, APIs, etc
//uses Express to create a new Router object. Remember in lesson 2 that using separate router files for specific elements of the application would keep the server.js file smaller and more manageable? That's what we're doing.
const router = new express.Router() //Creating a new router object from the Express framework
//brings the inventory controller into this router document's scope to be used.
const invController = require("../controllers/invController") // importing functionality (like functions or objects) defined in the invController.js file and making it available in the current file under the name invController.


const utilities = require("../utilities/index")
// Route to build inventory by classification view
//the route, which is divided into three elements:
//"get" indicates that the route will listen for the GET method within the request (typically a clicked link or the URL itself).
///type/:classificationId the route being watched for (note that the inv element of the route is missing, but it will be accounted for later).
//invController.buildByClassification indicates the buildByClassification function within the invController will be used to fulfill the request sent by the route.
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId)); //invController.buildByClassificationId: This is the controller function that will be executed when the route is accessed. The function is expected to be defined in the invController module (which you've imported earlier with require("../controllers/invController")). This function might contain logic to fetch and display inventory items of a particular classification based on the classificationId.


//New Route for Single Inventory View:
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInv_id)); //invController.buildByInv_id: This is another controller function in the invController module. It's expected to contain logic to fetch and display the details of a single inventory item based on the provided inv_id.

module.exports = router; //This line exports the router object so it can be imported and used in other parts of the application