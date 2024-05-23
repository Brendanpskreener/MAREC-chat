const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi')

async function on_connect(connectionId, user_name, user_id) {
  try {
    if (!connectionId) {
      return
    }

  } catch (error) {
    console.log(error)
  }
}

async function on_disconnect(connectionId) {
  try {
    if (!connectionId) {
      return
    }
  } catch (error) {
    console.log(error)
  }
}

async function sendToOne(connectionId, body, endpoint) {
  try {
    if (!connectionId) {
      return
    }
    //might want to JSON.parse the body, add a timestamp, and stringify it back
    const client = new ApiGatewayManagementApiClient({ endpoint })
    const postParams = {
      'ConnectionId': connectionId,
      'Data': body
    }
    const command = new PostToConnectionCommand(postParams)
    await client.send(command)
  } catch (error) {
    console.log(error)
  }
}

async function sendToAll(connectionId, body, endpoint) {

}

module.exports = { on_connect, on_disconnect, sendToOne, sendToAll }