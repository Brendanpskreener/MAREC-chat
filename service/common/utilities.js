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

async function on_message(connectionId, body, endpoint) {
  try {
    if (!connectionId) {
      return
    }
    const message = JSON.parse(body)
    const client = new ApiGatewayManagementApiClient({ endpoint })
    const postParams = {
      'ConnectionId': connectionId,
      'Data': message.message
    }
    const command = new PostToConnectionCommand(postParams)
    await client.send(command)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { on_connect, on_disconnect, on_message }