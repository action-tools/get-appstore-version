import fs from 'fs'
import jwt from 'jsonwebtoken'
import { messages } from './messages.js'

export default class Token {

  constructor(keyRaw, keyFile, keyFileBase64) {
    if (!!keyRaw) {
      console.log(messages.using_raw_private_key)
      this.privateKey = keyRaw
    } else if (!!keyFile) {
      console.log(messages.using_file_private_key)
      this.privateKey = fs.readFileSync(keyFile)
    } else if (!!keyFileBase64) {
      console.log(messages.base64_private_key_decryption)
      const keyFilename = 'authkey.p8'
      const buffer = Buffer.from(keyFileBase64, 'base64')
      fs.writeFileSync(keyFilename, buffer)
      this.privateKey = fs.readFileSync(keyFilename)
      console.log(messages.using_base64_private_key)
    } else {
      throw new Error(messages.appstore_connect_setup_error)
    }
  }

  generate(appId, issuerId, keyId, scope) {
    const exp = '20m'
    const alg = 'ES256'
    const aud = 'appstoreconnect-v1'
    const payload = { iss: issuerId, aud: aud, scope: [scope] }
    const jwtOptions = { expiresIn: exp, algorithm: alg, header: { kid: keyId } }
    return jwt.sign(payload, this.privateKey, jwtOptions)
  }
}
