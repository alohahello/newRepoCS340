const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
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
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
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

    return { data, display }
}


/* **************************************
* Build the inventory detail view HTML by ID.
* ************************************ */
Util.buildVehicleDetails = function (data) {

    let itemHTML = '';

    if (data) {
        itemHTML += '<div class="inventory-detail">';
        itemHTML += `<img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}" />`;
        itemHTML += '<div class="details">';
        itemHTML += `<p><strong>Make:</strong> ${data.inv_make}</p>`;
        itemHTML += `<p><strong>Model:</strong> ${data.inv_model}</p>`;
        itemHTML += `<p><strong>Year:</strong> ${data.inv_year}</p>`;
        itemHTML += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>`;
        itemHTML += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</p>`;
        itemHTML += `<p><strong>Color:</strong> ${data.inv_color}</p>`;
        itemHTML += `<p><strong>Description:</strong> ${data.inv_description}</p>`;
        // Add other details as needed
        itemHTML += '</div>';
        itemHTML += '</div>';
    } else {
        itemHTML += '<p class="notice">Sorry, the requested vehicle details could not be found.</p>';
    }
    return itemHTML;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
Util.handleIntentionalErrors = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(err => {
        next({ status: 500, message: err.message });
    });

module.exports = Util