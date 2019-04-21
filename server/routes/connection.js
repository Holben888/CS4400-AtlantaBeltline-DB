const mysql = require('mysql')
const util = require('util')
const dotenv = require('dotenv')

dotenv.config()

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'Phase3AtlantaBeltline',
})

db.connect()

db.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
  if (error || !results || !results.length) throw error
  console.log('The solution is: ', results[0].solution)
})

// To allow us to use "await" to grab the result
const query = util.promisify(db.query).bind(db)

module.exports = query
