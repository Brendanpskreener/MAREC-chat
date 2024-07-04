const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi')
const { API_DOMAIN, STAGE } = process.env
const ENDPOINT = `https://${API_DOMAIN}/${STAGE}`
const client = new ApiGatewayManagementApiClient({ endpoint: ENDPOINT })

async function sendToOne(connectionId, body) {
  const data = JSON.stringify(body)
  const postParams = {
    'ConnectionId': connectionId,
    'Data': data
  }
  const command = new PostToConnectionCommand(postParams)
  await client.send(command)
}

async function sendToAll(connectionIds = [], body) {
  const promiseArray = connectionIds.map(connectionId => sendToOne(connectionId, body))
  return Promise.all(promiseArray)
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


module.exports = { parseEvent, sendToOne, sendToAll }