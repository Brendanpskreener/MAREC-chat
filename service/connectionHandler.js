/**
 * @module connectionHandler
 * @description Handles the lifecycle state of a websocket client connection
*/

const { sendToOne, sendToAll } = require("./common/utilities")

let users = []

async function handler(event) {
  console.log(event)
  try {
    const { body, routeKey, connectionId, queryStringParameters } = parseEvent(event)
    switch (routeKey) {
      case "$connect": {
        //const { user_name, user_id } = queryStringParameters
        users.push(connectionId)
        //await on_connect(connectionId, user_name, user_id)
        break;
      }
      case "$disconnect": {
        const remainingUsers = users.filter(user => user !== connectionId)
        users = remainingUsers
        const message = {
          username: "Server Admin",
          text: `${connectionId} disconnected`,
          users
        }
        await sendToAll(users, message)
        //await on_disconnect(connectionId)
        break;
      }
      case "joinMessage": {
        const joinMessage = {
          username: "Server Admin",
          text: `${connectionId} connected`,
          users
        }
        await sendToAll(users, joinMessage)
        break;
      }
      case "sendPublic": {
        const { text } = JSON.parse(body)
        const publicMessage = {
          username: connectionId,
          text,
          users
        }
        await sendToAll(users, publicMessage)
        break;
      }
      case "sendPrivate": {
        const { to, text } = JSON.parse(body)
        const privateMessage = {
          username: connectionId,
          text,
          users
        }
        await sendToOne(to, privateMessage)
        break;
      }
      default:
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify("success")
    }
  } catch (error) {
    console.error(error)
    if (error?.statusCode) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify(error.message)
      }
    }
    return {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error")
    }
  }

}


function parseEvent(event) {
  const { body, requestContext: { routeKey, connectionId }, queryStringParameters = {} } = event

  if (!routeKey || !connectionId) {
    const error = new Error("Invalid Request")
    error.statusCode = 400
    throw error
  }

  return { body, routeKey, connectionId, queryStringParameters }
}

module.exports = { handler }