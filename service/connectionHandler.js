/**
 * @module connectionHandler
 * @description Handles the lifecycle state of a websocket client connection
*/

const { on_connect, on_disconnect, sendToOne, sendToAll } = require("./common/utilities")

let users = []

async function handler(event) {
  console.log(event)
  const { body, requestContext: { routeKey, connectionId, domainName, stage }, queryStringParameters = {} } = event
  const endpoint = `https://${domainName}/${stage}`
  switch (routeKey) {
    case "$connect":
      const { user_name, user_id } = queryStringParameters
      users.push(connectionId)
      //await on_connect(connectionId, user_name, user_id)
      break;
    case "$disconnect":
      const remainingUsers = users.filter(user => user !== connectionId)
      users = remainingUsers
      const message = {
        username: "Server Admin",
        text: `${connectionId} disconnected`,
        users
      }
      await sendToAll(users, message, endpoint)
      //await on_disconnect(connectionId)
      break;
    case "joinMessage":
      const joinMessage = {
        username: "Server Admin",
        text: `${connectionId} connected`,
        users
      }
      await sendToAll(users, joinMessage, endpoint)
      break;
    case "sendPublic":
      const { text } = JSON.parse(body)
      const publicMessage = {
        username: connectionId,
        text,
        users
      }
      await sendToAll(users, publicMessage, endpoint)
      break;
    case "sendPrivate":
      await sendToOne()
      break;
    default:
      break;
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify("success")
  }
  return response
}

module.exports = { handler }