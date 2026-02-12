// our inventory-model.js document is where we'll write all the functions to interact with the classification and inventory tables of the database

const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
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
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get details
 * ************************** */
async function getInventoryByDetailId(detail_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`,
      [detail_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByDetailId error " + error)
  }
}


/* *****************************
*   Register new classification 
* *************************** */
async function registerClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Register new classification 
* *************************** */
async function registerInventory(classification_id,inv_make,inv_model,inv_description,inv_image,inv_thumbnail,inv_price,inv_year,inv_miles,inv_color){ //
  try {
    const sql = "INSERT INTO public.inventory (classification_id,inv_make,inv_model,inv_description,inv_image,inv_thumbnail,inv_price,inv_year,inv_miles,inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *" //
    const result =await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]) //
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql ='DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    new Error ("Delete Inventory Error")
    console.error("model error: " + error)
  }
}


/* *****************************
* Add a new review
* ***************************** */
async function addReview(rev_text, rev_rate, inv_id, account_id) {
  try {
    const sql = "INSERT INTO public.review (rev_text, rev_rate, inv_id, account_id) VALUES ($1, $2, $3, $4) RETURNING *"
    const result = await pool.query(sql, [rev_text, rev_rate, inv_id, account_id])
    return result.rowCount > 0 
  } catch (error) {
    console.error("addReview error:", error)
    return false
  }
}

/* ***************************
 *  Get reviews 
 * ************************** */
async function getReviewById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, a.account_firstname, a.account_lastname 
       FROM public.review AS r 
       JOIN public.account AS a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.rev_date DESC`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewById error " + error)
  }
}




module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByDetailId, registerClassification, registerInventory, updateInventory, deleteInventory,addReview, getReviewById};
