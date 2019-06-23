const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function seedUsers(db, users) {
   const preppedUsers = users.map(user => ({
     ...user,
     password: bcrypt.hashSync(user.password, 1)
   }))
   return db.into('users').insert(preppedUsers)
     .then(() =>
      
       db.raw(
         `SELECT setval('users_id_seq', ?)`,
         [users[users.length - 1].id],
       )
     )
  }
  
    function seedRestosTables(db, users, restaurants, comments=[]) {
      
      return db.transaction(async trx => {
  
     await seedUsers(trx, users)
  
     await trx.into('restaurants').insert(restaurants)      
       
    
     await trx.raw(
       `SELECT setval('restaurants_id_seq', ?)`,
       [restaurants[restaurants.length - 1].id],
     )
      
    })}
  
    function seedMaliciousRestos(db, user, restaurant) {
  
   return seedUsers(db, [user])
        .then(() =>
          db
            .into('restaurants')
            .insert([restaurant])
        )
    }

 function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
   const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
      })
   return `Bearer ${token}`
 }

  module.exports = {
    makeUsersArray,
    makeRestosArray,
    makeExpectedResto,
    makeExpectedRestoComments,
    makeMaliciousResto,
    makeCommentsArray,

    makeRestosFixtures,
    cleanTables,
    seedRestosTables,
    seedMaliciousResto,
   makeAuthHeader,
   seedUsers
  }
