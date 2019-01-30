const humps = require('humps')

module.exports = pgPool => {
  return {
    async createUser (username, fullName, language) {
      try {
        const user = await pgPool.query(`INSERT INTO users(username, full_name, language) values
          ($1, $2, $3) returning *`, [username, fullName, language])

        return humps.camelizeKeys(user.rows[0])
      } catch (err) {
        throw new Error(err)
      }
    },

    async createTrip (name, placeName, userId) {
      try {
        const trip = await pgPool.query(`INSERT INTO trips(name, place_name, user_id) values
          ($1, $2, $3) returning *`, [name, placeName, userId])

        return humps.camelizeKeys(trip.rows[0])
      } catch (err) {
        throw new Error(err)
      }
    },

    async createComment (userComment, tripId, userId) {
      try {
        const comment = await pgPool.query(`INSERT INTO trip_comments(comment, trip_id, user_id) values
          ($1, $2, $3) returning *`, [userComment, tripId, userId])

        return humps.camelizeKeys(comment.rows[0])
      } catch (err) {
        throw new Error(err)
      }
    },

    async getUsers () {
      try {
        const users = await pgPool.query(`select * from users`)

        return humps.camelizeKeys(users.rows)
      } catch (err) {
        throw new Error(err)
      }
    },

    async getUserByUsername (username) {
      try {
        const user = await pgPool.query(`select * from users where username = $1`, [username])

        return humps.camelizeKeys(user.rows[0])
      } catch (err) {
        throw new Error(err)
      }
    },

    async getTrips () {
      try {
        const trips = await pgPool.query(`select * from trips`)

        return humps.camelizeKeys(trips.rows)
      } catch (err) {
        throw new Error(err)
      }
    },

    async getTripById (id) {
      try {
        const trip = await pgPool.query(`select * from trips where id = $1`, [id])

        return humps.camelizeKeys(trip.rows[0])
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}
