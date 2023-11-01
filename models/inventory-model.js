const pool = require("../database/") //imports the database connection file (named index.js) from the database folder which is one level above the current file. Because the file is index.js, it is the default file

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() { //creates an "asynchronous" function, named getClassifications. An asynchronous function returns a promise, without blocking (stopping) the execution of the code. It allows the application to continue and will then deal with the results from the promise when delivered.
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") //will return (send back) the result of the SQL query, which will be sent to the database server using a pool connection, when the resultset (data) or an error, is sent back by the database server. Notice the two keywords: return and await. Await is part of the Async - Await promise structure introduced in ES6. Return is an Express keyword, indicating that the data should be sent to the code location that called the function originally.
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) { //declares an asynchronous function by name and passes a variable, which should contain the classification_id value, as a parameter.
    try {
        //creates an SQL query to read the inventory and classification information from their respective tables using an INNER JOIN. The query is written using a prepared statement. The "$1" is a placeholder, which will be replaced by the value shown in the brackets "[]" when the SQL statement is run. The SQL is queried against the database via the database pool. Note the await keyword, which means this query will wait for the information to be returned, where it will be stored in the data variable.
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows //sends the data, as an array of all the rows, back to where the function was called (in the controller).
    } catch (error) { //ends the try and opens the catch, with an error variable being supplied to store any error that may occur.
        console.error("getclassificationsbyid error " + error) //writes the error, if any, to the console for us to read. We will have to deal with a better error handler in the future.
    }
}


/* ***************************
 *  Get 
 * ************************** */
async function getInventoryByInvId(inv_id) { //Declares an asynchronous function named getInventoryByInvId with one parameter, inv_id
    try { // Starts a try block to execute code that might throw errors
        // Await pauses the function execution until the query is resolved. pool.query executes an SQL query.
        // "select * from inventory where inv_id = $1" selects all records from the 'inventory' table where 'inv_id' matches the provided inv_id
        // [inv_id] is an array of parameters that replaces $1 in the SQL query to prevent SQL injection
        const data = await pool.query("select * from inventory where inv_id = $1", [inv_id])
        return data.rows // Returns the rows of the query result, which contain the inventory data matching the provided inv_id
    } catch (error) { // Catches any errors that occur in the try block
        console.error("get inventory-model by id error " + error) // Logs the error to the console with a custom message
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByInvId }; //exports the function for use elsewhere.