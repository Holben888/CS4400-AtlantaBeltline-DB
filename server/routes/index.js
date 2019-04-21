const express = require('express')
const router = express.Router()
const query = require('./connection')

const admin = require('./admin')

router.use('/admin', admin)

router.get('/login', async (req, res, err) => {
  if (!req.query.email || !req.query.password) {
    res.sendStatus(400)
    return
  }

  const matchingUsers = await query(
    `SELECT Firstname, Lastname, Username FROM User NATURAL JOIN UserEmail
    WHERE email=\"${req.query.email}\"
    AND password=\"${req.query.password}\"
    LIMIT 1`
  )

  if (!matchingUsers || !matchingUsers.length) {
    res.sendStatus(401)
    return
  }

  const user = matchingUsers[0]

  const employeeRoles = await query(
    `SELECT isAdmin, isMngr, isStaff FROM employee
    WHERE username=\"${user.Username}\"
    LIMIT 1`
  )

  if (!employeeRoles || !employeeRoles.length) {
    const visitorRecord = await query(`SELECT * FROM Visitor
      WHERE username=\"${user.Username}\"`)
    if (visitorRecord && visitorRecord.length) {
      var role = 'Visitor'
    } else {
      var role = 'User'
    }
  } else {
    if (employeeRoles[0].isAdmin) {
      var role = 'Admin'
    } else if (employeeRoles[0].isMngr) {
      var role = 'Manager'
    } else {
      var role = 'Staff'
    }
  }

  res.send({ ...user, Role: role })
})

module.exports = router