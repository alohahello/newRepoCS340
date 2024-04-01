// const pool = require("../database")
const invModel = require("../models/inventory-model") // brings the inventory-model.js file into scope and stores its functionality into a invModel variable.
const utilities = require("../utilities/index") // brings the utilities > index.js file into scope and stores its functionality into an utilities variable.

const invCont = {} //creates an empty object in the invCont variable.


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) { //creates an asynchronous, anonymous function which accepts the request and response objects, along with the Express next function as parameters. The function is stored into a named method of buildByClassificationId.
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
            errors: null,
        });
    } catch (error) {
        console.error("getInventoryItemDetail error " + error);
        // Handle the error and send an appropriate response
        res.status(500).send("Internal Server Error");
    }
}

/* ***************************
 *  Build inventory item details by inventory_id
 * ************************** */
invCont.buildByInv_id = async function (req, res, next) { // Defines an asynchronous method buildByInv_id on the invCont object
    try { // Start of a try block to catch any exceptions or errors that occur within
        const inv_id = req.params.inv_id;  // Retrieves the inv_id parameter from the request URL
        let { data, display } = await utilities.getVehicleDetails(inv_id);
        // Calls another utility function getNav and awaits its result
        let nav = await utilities.getNav();
        const car_data = await utilities.buildVehicleDetails(data[0])
        console.log(car_data)

        // Uses the express.js 'res.render' method to render a view with the specified context
        res.render('./inventory/invByCar_id', {
            title: `${data[0].inv_Make} ${data[0].inv_Model}`, // Sets the page title using year, make, and model
            nav,  // Passes navigation data to the view
            // car_data, // Passes singleCar data to the view
            display,
            message: null,
            errors: null,
        });
    } catch (error) { // Catch block for handling exceptions
        next(error); // Passes the error to the next middleware function for error handling
    }
}

module.exports = invCont;