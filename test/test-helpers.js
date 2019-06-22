const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function seedUsers(db, users) {
   const preppedUsers = users.map(user => ({
     ...user,
     password: bcrypt.hashSync(user.password, 1)
   }))
   return db.into('blogful_users').insert(preppedUsers)
     .then(() =>
       // update the auto sequence to stay in sync
       db.raw(
         `SELECT setval('blogful_users_id_seq', ?)`,
         [users[users.length - 1].id],
       )
     )
  }
  
    function seedArticlesTables(db, users, articles, comments=[]) {
      
      return db.transaction(async trx => {
  
     await seedUsers(trx, users)
  
     await trx.into('blogful_articles').insert(articles)      
       
    
     await trx.raw(
       `SELECT setval('blogful_articles_id_seq', ?)`,
       [articles[articles.length - 1].id],
     )
      
    })}
  
    function seedMaliciousArticle(db, user, article) {
  
   return seedUsers(db, [user])
        .then(() =>
          db
            .into('blogful_articles')
            .insert([article])
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
    makeArticlesArray,
    makeExpectedArticle,
    makeExpectedArticleComments,
    makeMaliciousArticle,
    makeCommentsArray,

    makeArticlesFixtures,
    cleanTables,
    seedArticlesTables,
    seedMaliciousArticle,
   makeAuthHeader,
   seedUsers
  }
