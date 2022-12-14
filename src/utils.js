import Token from './token.js'

export default class Utils {

  constructor() {
    this.defaultLimit = 2
  }

  getToken(appId, issuerId, keyId, jwt, pkRaw, pkFilePath, pkFileBase64) {
    if (!!jwt) {
      console.log("Predefined Json Web Token has been set.")
      return jwt
    }

    console.log("Predefined Json Web Token hasn't been passed.")
    console.log("Setting up the private key...")
    const token = new Token(pkRaw, pkFilePath, pkFileBase64)
    console.log("Starting automatic token generation...")
    return token.generate(appId, issuerId, keyId)
  }

  getLimit(limitInput) {
    if (!limitInput) {
      return this.defaultLimit
    }

    const limit = parseInt(limitInput)

    if (!limit) {
      return this.#getLimitWithWarning("Input must be a number")
    }

    if (limit > 200) {
      return this.#getLimitWithWarning("Maximum value is 200")
    }

    return limit
  }

  prepareJsonString(jsonObject) {
    return JSON.stringify(jsonObject)
  }

  #getLimitWithWarning(message) {
    console.log(`Warning ('versions-limit' input): ${message}. Using default value instead...`)
    return this.defaultLimit
  }
}
