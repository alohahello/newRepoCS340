const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getInventoryByClassificationId" + error)
    }
}

/* ***************************
 *  Get 
 * ************************** */
async function getInventoryByInvId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [inv_id]  // This should match the function parameter
        );
        return data.rows[0]; // Returns the first row of the result which should be the inventory item
    } catch (error) {
        console.error("getInventoryByInvId error " + error);
        throw error;
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByInvId }; //exports the function for use elsewhere.