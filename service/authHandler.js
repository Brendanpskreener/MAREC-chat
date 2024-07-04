const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-west-2_V8jAMpVLR",
  tokenUse: "id",
  clientId: "4ojucaih0hkhva2k12mlth97qb"
})

async function handler(event, context) {
  console.log(event, context)
  try {
    const { queryStringParameters: { Auth } } = event
    const payload = await verifier.verify(Auth)
    if (!payload) {
      return 'Unauthorized'
    }
    const { email } = payload
    return {
      context: {
        email
      },
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        }],
      },
    }
  } catch (error) {
    return 'Unauthorized'
  }
}

module.exports = { handler }