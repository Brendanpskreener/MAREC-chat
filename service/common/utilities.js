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

async function on_message(connectionId, body, callbackUrl) {
  try {
    if (!connectionId) {
      return
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { on_connect, on_disconnect, on_message }