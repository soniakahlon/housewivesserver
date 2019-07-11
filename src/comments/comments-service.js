const xss = require('xss')

const CommentsService = {
  getById(db, id) {
    return db
      .from('comments AS comm')
      .select(
        'comm.id',
        'comm.text',
        'comm.date_created',
        'comm.restaurant_id',
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .leftJoin(
        'users AS usr',
        'comm.user_id',
        'usr.id',
      )
      .where('comm.id', id)
      .first()
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('comments')
      .returning('*')
      .then(([comments]) => comments)
      .then(comments =>
        CommentsService.getById(db, comments.id)
      )
  },

  serializeComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      text: xss(comment.text),
      article_id: comment.restaurant_id,
      date_created: new Date(comment.date_created),
      user: {
        id: comment.id,
        text: comment.text,
        date_created: new Date(comment.date_created),
        date_modified: new Date(comment.date_modified) || null
      },
    }
  }
}

module.exports = CommentsService
