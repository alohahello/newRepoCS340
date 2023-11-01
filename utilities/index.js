const invModel = require("../models/inventory-model") //requires the inventory-model file, so it can be used to get data from the database.
const Util = {} //creates an empty Util object. Just as you did earlier in the base controller.

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) { //creates an asynchronous function, which accepts the request, response and next methods as parameters. The function is then stored in a getNav variable of the Util object.
    let data = await invModel.getClassifications() //calls the getClassifications() function from the inventory-model file and stores the returned result set into the data variable.
    //This is to see the data in the console
    console.log(data) //When the function is called and the data returned, it will be written to the server console and can be seen in the built-in VS Code terminal. It would look like the illustration below.
    let list = "<ul>" //creates a JavaScript variable named list and assigns a string to it. In this case, the string is the opening of an HTML unordered list. Note the use of let. This is because the value will be changed as the upcoming lines of the function are processed.
    list += '<li><a href="/" title="Home page">Home</a></li>' //the list variable has an addition string added to what already exists. Note the use of +=, which is the JavaScript append operator. In this instance a new list item, containing a link to the index route, is added to the unordered list.
    data.rows.forEach((row) => { //uses a forEach loop to move through the rows of the data array one at a time. For each row, the row is assigned to a row variable and is used in the function.
        list += "<li>" //appends an opening list item to the string in the list variable.
        list += //appends the code that is found on lines 14 through 20 as a string to the list variable.
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' + //a string that includes the beginning of an HTML anchor. The + sign is the JavaScript concatenation operator, used to join two strings together. The value in the href attribute is part of a route that will be watched for in an Express router.
            row.classification_name + //the classification_id value found in the row from the array. It is being added into the link route.
            ' vehicles">' + // the title attribute of the anchor element
            row.classification_name + // the classification_name value found in the row from the array. It is being added into the title attribute.
            "</a>" //the last part of the string forming the opening HTML anchor tag.
        list += "</li>" //the classification_name from the row being displayed between the opening and closing HTML anchor tags. This is the display name in the navigation bar.
    })
    list += "</ul>"
    return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) { //declares the function as asynchronous and expects a data array as a parameter.
    let grid //declares a variable to hold a string.
    if (data.length > 0) { //an "if" to see if the array is not empty.
        grid = '<ul id="inv-display">' //creates an unordered list element and adds it to the grid variable.
        data.forEach(vehicle => { //sets up a "forEach" loop, to break each element of the data array into a vehicle object.
            // builds a single HTML <li>. Withing the list item is an <a> element that surrounds an <img> element. Next is a <div> that contains a horizontal rule, followed by an <h2> that contains another <a> with the Make and Model of the vehicle. Finally, is a <span> that contains a formatted price, in US dollars.
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else { //ends the "if" and opens an "else". The else is executed if the data array is empty.
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>' //stores a <p> with a message indicating that no vehicles match the classification.
    }
    return grid //returns the variable to the calling location.
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* *******
******* */
Util.getVehicleDetails = async function (inv_id) {
    

    let data = await invModel.getInventoryByInvId(inv_id)

    let display = await Util.buildVehicleDetails(data)

    return{data, display}
}


/* **************************************
* Build the inventory detail view HTML by ID.
* ************************************ */
Util.buildVehicleDetails = async function (data) {

    // let data = data[0]
    let display = `
    display = '<section class="carBlock">'
    display += '<div>'
    display += '<img class="carPicture" src=' + data.inv_image
        + ' alt="' + data.inv_make + ' ' + data.inv_model
        + ' on CSE Motors" />'
    display += '</div>'
    display += '<div class="CarDetails">'
    display += '<h3 class="carTitle">' + data.inv_year + '</h3>'
    let formattedprice = Number(data.inv_price).toLocaleString("en-US")
    display += '<p class="price">Price: $' + formattedprice + '</p>'
    let formattedMiles = data.inv_miles.toLocaleString("en-US")
    display += '<p class="miles">Miles: ' + formattedMiles + '</p>'
    display += '<p class="color">Color: ' + data.inv_color + '</p>'
    display += '<p class ="description"> Description: ' + data.inv_description + '</p>'
    display += '</div>'
    display += '</section>'`
    return display


    // if (!vehicleData || typeof vehicleData !== 'object') {
    //     return '<p>Vehicle not found. </p>';
    // }

    // const html = ' <div class = "vehicle-details">';

    // // keep going from here

    // html += '<img src="' + vehicle.inv_image + '" alt="Image of vehicle '
    //     + vehicle.inv_make + ' ' + vehicle.inv_model + ' CSE Motors" />';
    // html += '<div class="vehicle-info">';
    // html += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>';
    // html += '<p>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>';

    // html += '</div>';  // End of vehicle-info
    // html += '</div>';  // End of vehicle-details

    // return html;
}

module.exports = Util