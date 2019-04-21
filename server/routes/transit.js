const express = require('express')
const router = express.Router()
const query = require('./connection')

router.get('/history', async (req, res, err) => {
  const transits = await query(`SELECT h.transitdate, h.transitroute, h.transittype, t.transitprice
  FROM transit AS t join usertransittaken AS h
  ON t.transittype=h.transittype AND t.transitroute=h.transitroute
  WHERE h.username=\"${req.query.username}\"
  ${
    req.query.orderBy
      ? `ORDER BY ${
          req.query.orderBy === 'transitroute'
            ? 't.' + req.query.orderBy
            : 'h.' + req.query.orderBy
        } ${req.query.sort}`
      : ''
  }
  `)

  if (!transits) res.sendStatus(400)
  else
    res.send({
      transits: transits.map(transit => {
        const d = new Date(transit.transitdate)
        transit.transitdate = d.toLocaleDateString('en-US')
        return transit
      }),
    })
})

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
