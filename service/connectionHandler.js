/**
 * @module connectionHandler
 * @description Handles the lifecycle state of a websocket client connection
*/

const { parseEvent, sendToOne, sendToAll } = require("./common/utilities")

let users = []

async function handler(event) {
  console.log(event)
  try {
    const { authorizer: { email }, body, routeKey, connectionId } = parseEvent(event)
    switch (routeKey) {
      case "$connect": {
        users.push(connectionId)
        break;
      }
      case "$disconnect": {
        const remainingUsers = users.filter(user => user !== connectionId)
        users = remainingUsers
        const message = {
          username: "Server Admin",
          text: `${email} disconnected`,
          users
        }
        await sendToAll(users, message)
        break;
      }
      case "joinMessage": {
        const joinMessage = {
          username: "Server Admin",
          text: `${email} connected`,
          users
        }
        await sendToAll(users, joinMessage)
        break;
      }
      case "sendPublic": {
        const { text } = JSON.parse(body)
        const publicMessage = {
          username: email,
          text,
          users
        }
        await sendToAll(users, publicMessage)
        break;
      }
      case "sendPrivate": {
        const { to, text } = JSON.parse(body)
        const privateMessage = {
          username: email,
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

module.exports = { handler }