async function handler(event, context) {
  // Your authorization logic here
  const isAuthorized = true; // Simplified authorization logic

  if (isAuthorized) {
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        }],
      },
    };
  } else {
    throw new Error("Unauthorized"); // This will deny the connection
  }
}

module.exports = { handler }