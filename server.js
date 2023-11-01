/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
//The new code uses the imported "baseController" to "call" the "buildHome" method.
//This will execute the function in the controller, build the navigation bar and pass it and the title name-value pair to the index.ejs view, which will then be sent to the client.
const baseController = require("./controllers/baseController") 
const utilities = require("./utilities/") //index is not require because index is the default name
const inventoryRoute= require("./routes/inventoryRoute")



/* ***********************
 * View Engine and Templates
 * Motor de Plantillas
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root



/* ***********************
 * Routes
 *************************/
// The call to the "buildHome" function in the "baseController" is being sent into 
// the higher order function you just wrote in the utilities file.
// app.get is an Express route handler, watching for the base route "/", with no other URL elements.
// utilities.handleErrors(baseController.buildHome) - the middleware function that catches any errors generated and sends them to the Express Error Handler.
app.get("/", utilities.handleErrors(baseController.buildHome)) //Route that trigger our home page

// Inventory routes
// composed of three elements:
// app.use() is an Express function that directs the application to use the resources passed in as parameters.
// /inv is a keyword in our application, indicating that a route that contains this word will use this route file to work with inventory-related processes; "inv" is simply a short version of "inventory".
// inventoryRoute is the variable representing the inventoryRoute.js file which was required (brought into the scope of the server.js file) earlier.
app.use("/inv", inventoryRoute)

app.use(static)


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => { //the Express use function containing an asynchronous arrow function.
  next({status: 404, message: 'Sorry, we appear to have lost that page.'}) //the next function to pass control to the next function in the processing chain. An object (in our case, an error object) with a status and message is sent. Remember that the Error Handler watches for an error object. We are sending an error object as identified by the error status and message.
})



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// app.use(async (err, req, res, next) => {
//   let nav = await utilities.getNav()
//   console.error(`Error at: "${req.originalUrl}": ${err.message}`)
//   res.render("errors/error", {
//     title: err.status || 'Server Error',
//     message: err.message,
//     nav
//   })
// })

app.use(async (err, req, res, next) => { //app.use is an Express function, which accepts the default Express arrow function to be used with errors.
  let nav = await utilities.getNav() //builds the navigation bar for the error view.
  console.error(`Error at: "${req.originalUrl}": ${err.message}`) //a console statement to show the route and error that occurred. This is helpful to you to know what the client was doing when the error occurred.
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'} //this line checks to see if the status code is 404. If so, the default error message - "File Not Found" - is assigned to the "message" property. If it is anything else, a generic message is used. Feel free to alter the generic message if desired.
  res.render("errors/error", { //calls the "error.ejs" view (you will build that next) in an "errors" folder
    title: err.status || 'Server Error', //sets the value of the "title" for the view. It will use the status code or "Server Error" as the title if no status code is set
    //only the generic message is sent, rather than the error.message as existed before.
    message, //sets the message to be displayed in the error view to the message sent in the error object. We will alter this later.
    nav // sets the navigation bar for use in the error view.
  })
})

// app.use(async (err, req, res, next) => {
//   try {
//       let nav = await utilities.getNav();
//       console.error(`Error at: "${req.originalUrl}": ${err.message}`);
//       res.render("errors/error", {
//           title: err.status || 'Server Error',
//           message: err.message,
//           nav
//       });
//   } catch (error) {
//       console.error(`An error occurred while getting nav: ${error.message}`);
//       // You might want to render an error page here too, but without the nav
//   }
// });

// app.use(async (err, req, res, next) => {
//   try {
//     let nav = await utilities.getNav(); // This is the async operation that could fail.
//     console.error(`Error at: "${req.originalUrl}": ${err.message}`);
//     // If there's an error while processing the request, render the error page with details.
//     res.render("errors/error", {
//       title: err.status || 'Server Error',
//       message: err.message,
//       nav, // navigation data retrieved from the getNav() function
//     });
//   } catch (error) {
//     console.error(`An error occurred while getting navigation data or rendering the error page: ${error.message}`);
//     // Since an error occurred while trying to get the nav data or render the error page,
//     // you should handle this gracefully, perhaps by rendering a basic error page without nav data or by sending a simple response.
//     res.status(500).send('An unexpected error occurred'); // You might want to render a different error page or handle this differently.
//   }
// });

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
