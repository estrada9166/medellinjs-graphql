const { orderedFor } = require('../utils/dataLoaders')

module.exports = pgPool => {
  return {
    async getUserById (ids) {
      try {
        const res = await pgPool.query(`select * from users where id = ANY($1)`, [ids])

        return orderedFor(res.rows, ids, 'id', true)
      } catch (err) {
        throw new Error(err)
      }
    },

    async getTripsByUserId (userIds) {
      try {
        const res = await pgPool.query(`select * from trips where user_id = ANY($1)`, [userIds])

        return orderedFor(res.rows, userIds, 'userId', false)
      } catch (err) {
        throw new Error(err)
      }
    },

    async getCommentsByTripId (ids) {
      try {
        const res = await pgPool.query(`select * from trip_comments where trip_id = ANY($1)`, [ids])

        return orderedFor(res.rows, ids, 'tripId', false)
      } catch (err) {
        throw new Error(err)
      }
    },
  }
}
