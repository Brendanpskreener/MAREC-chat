const { on_connect, on_disconnect, sendToOne, sendToAll } = require("./common/utilities")

async function handler(event) {
  console.log(event)
  const { body, requestContext: { routeKey, connectionId, domainName, stage }, queryStringParameters = {} } = event
  const endpoint = `https://${domainName}/${stage}`
  switch (routeKey) {
    case "$connect":
      const { user_name, user_id } = queryStringParameters
      await on_connect(connectionId, user_name, user_id)
      break;
    case "$disconnect":
      await on_disconnect(connectionId)
      break;
    case "sendPublic":
      await sendToOne(connectionId, body, endpoint)
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