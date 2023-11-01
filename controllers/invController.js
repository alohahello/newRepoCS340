const pool = require("../database")
const invModel = require("../models/inventory-model") // brings the inventory-model.js file into scope and stores its functionality into a invModel variable.
const utilities = require("../utilities/index") // brings the utilities > index.js file into scope and stores its functionality into an utilities variable.

const invCont = {} //creates an empty object in the invCont variable.


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) { //creates an asynchronous, anonymous function which accepts the request and response objects, along with the Express next function as parameters. The function is stored into a named method of buildByClassificationId.
    const classification_id = req.params.classificationId //collects the classification_id that has been sent, as a named parameter, through the URL and stores it into the classification_id variable. req is the request object, which the client sends to the server. params is an Express function, used to represent data that is passed in the URL from the client to the server. classificationId is the name that was given to the classification_id value in the inventoryRoute.js file (see line 7 of that file). 
    const data = await invModel.getInventoryByClassificationId(classification_id) //calls the getInventoryByClassificationId function (you'll build that next), which is in the inventory-model file and passes the classification_id as a parameter. The function "awaits" the data to be returned, and the data is stored in the data variable.
    const grid = await utilities.buildClassificationGrid(data) //calls a utility function to build a grid, containing all vehicles within that classification (you'll build this later in this activity). Note that the "data" array is passed in as a parameter. An HTML string, containing a grid, is returned and stored in the grid variable.
    let nav = await utilities.getNav() //calls the function to build the navigation bar for use in the view and stores it in the nav variable.
    const className = data[0].classification_name //extracts the name of the classification, which matches the classification_id, from the data returned from the database and stores it in the className variable.
    res.render("./inventory/classification", { //calls the Express render function to return a view to the browser. The view to be returned is named classification-view, which will be created within an inventory folder, within the already existing views folder.
        title: className + " vehicles", //build the "title" value to be used in the head partial, but you'll notice that it is dynamic to match the data.
        nav, //contains the nav variable, which will display the navigation bar of the view.
        grid, //contains the HTML string, containing the - grid - of inventory items.
    })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByInv_id = async function (req, res, next) { // Defines an asynchronous method buildByInv_id on the invCont object
    try { // Start of a try block to catch any exceptions or errors that occur within
        const inv_id = req.params.inv_id;  // Retrieves the inv_id parameter from the request URL

        // Calls a utility function buildVehicleDetails with inv_id, and destructures its response into data and singleCar
        let {data, display} = await utilities.getVehicleDetails(inv_id);


        // Calls another utility function getNav and awaits its result
        let nav = await utilities.getNav();
        // const car_data = await utilities.buildVehicleDetails(data[0])
        // console.log(car_data)

        // Uses the express.js 'res.render' method to render a view with the specified context
        res.render('./inventory/invByCar_id', {
            title: `${data[0].inv_Make} ${data[0].inv_Model}`, // Sets the page title using year, make, and model
            nav,  // Passes navigation data to the view
            // car_data, // Passes singleCar data to the view
            display,
            message:null, 
            errors:null,
        });
    } catch (error) { // Catch block for handling exceptions
        next(error); // Passes the error to the next middleware function for error handling
    }
}

module.exports = invCont;