'use strict'

const Model = require('./model')

const users = async (obj, args, ctx) => {
  return Model(ctx.pgPool).getUsers()
}

const userByUsername = async (obj, args, ctx) => {
  return Model(ctx.pgPool).getUserByUsername(args.username)
}

const trips = async (obj, args, ctx) => {
  return Model(ctx.pgPool).getTrips()  
}

const tripById = async (obj, args, ctx) => {
  return Model(ctx.pgPool).getTripById(args.id)
}

const createUser = async (obj, { input }, ctx) => {
  const { username, fullName, language } = input

  return Model(ctx.pgPool).createUser(username, fullName, language)
}

const createTrip = async (obj, { input }, ctx) => {
  let { name, placeName, userId } = input

  userId = parseInt(userId)
  return Model(ctx.pgPool).createTrip(name, placeName, userId)
}

const createComment = async (obj, { input }, ctx) => {
  let { comment, tripId, userId } = input
  
  userId = parseInt(userId)
  tripId = parseInt(tripId)

  await Model(ctx.pgPool).createComment(comment, tripId, userId)

  return Model(ctx.pgPool).getTripById(tripId)
}

module.exports = {
  Query: {
    users,
    userByUsername,
    trips,
    tripById
  },
  Mutation: {
    createUser,
    createTrip,
    createComment
  },
  User: {
    trips (user, __, ctx) {
      return ctx.loaders.getTripsByUserId.load(user.id)
    },
  },
  Trip: {
    user (trip, __, ctx) {
      return ctx.loaders.getUserById.load(trip.userId)
    },

    comments (trip, __, ctx) {
      return ctx.loaders.getCommentsByTripId.load(trip.id)
    }
  },
  Comment: {
    user (comment, __, ctx) {
      return ctx.loaders.getUserById.load(comment.userId)
    },
  }
}