import util from 'node:util'
import Token from './token.js'
import { messages } from './messages.js'

export default class Utils {

  constructor() {
    this.defaultLimit = 2
  }

  getToken(appId, issuerId, keyId, jwt, pkRaw, pkFilePath, pkFileBase64, scope) {
    if (!!jwt) {
      console.log(messages.predefined_jwt_set)
      return jwt
    }

    console.log(messages.predefined_jwt_not_set)
    console.log(messages.setting_private_key)
    const token = new Token(pkRaw, pkFilePath, pkFileBase64)
    console.log(messages.automatic_token_generation)
    return token.generate(appId, issuerId, keyId, scope)
  }

  getLimit(limitInput) {
    if (!limitInput) {
      return this.defaultLimit
    }

    const limit = parseInt(limitInput)

    if (!limit) {
      return this.#getLimitWithWarning(messages.input_number_warning)
    }

    if (limit > 200) {
      return this.#getLimitWithWarning(util.format(messages.max_value_warning, '200'))
    }

    return limit
  }

  prepareJsonString(jsonObject) {
    return JSON.stringify(jsonObject)
  }

  #getLimitWithWarning(message) {
    console.log(util.format(messages.general_warning, message))
    return this.defaultLimit
  }
}
