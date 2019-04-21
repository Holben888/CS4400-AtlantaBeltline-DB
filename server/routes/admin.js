const express = require('express')
const router = express.Router()
const query = require('./connection')

router.post('/setUserStatus', async (req, res, err) => {
  if (!req.query.status || !req.query.username) {
    res.sendStatus(400)
    return
  }
  const update = await query(
    `UPDATE user SET status=\"${req.query.status}\"
    WHERE username=\"${req.query.username}\"`
  )
  if (update && update.affectedRows) res.send({})
  else res.sendStatus(400)
})

router.get('/userManager', async (req, res, err) => {
  const users = await query(`
  SELECT u.username, (SELECT COUNT(*) FROM useremail AS ue WHERE u.username = 
               ue.username) AS emails,
               status
  FROM user AS u
  ${
    req.query.orderBy
      ? `ORDER BY ${
          req.query.orderBy === 'emails'
            ? req.query.orderBy
            : 'u.' + req.query.orderBy
        } ${req.query.sort}`
      : ''
  }
  `)

  if (!users) res.sendStatus(404)
  else res.send({ users: users })
})

module.exports = router
