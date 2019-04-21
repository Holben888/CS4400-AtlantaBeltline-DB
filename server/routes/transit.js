const express = require('express')
const router = express.Router()
const query = require('./connection')

router.get('/', async (req, res, err) => {
  const transits = await query(
    `SELECT transitroute, transittype, transitprice, (SELECT COUNT(*)
    FROM transitconnection as c
                               WHERE c.transittype=t.transittype AND c.transitroute=t.transitroute) AS 
                               num_connected_sites
  FROM transit as t
  ${
    req.query.orderBy
      ? `ORDER BY ${
          req.query.orderBy === 'num_connected_sites'
            ? req.query.orderBy
            : 't.' + req.query.orderBy
        } ${req.query.sort}`
      : ''
  }
  `
  )

  if (!transits) res.sendStatus(400)
  else res.send({ transits: transits })
})

module.exports = router
