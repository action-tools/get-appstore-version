import core from '@actions/core'
import Token from './token.js'
import request from './request.js'

async function run() {
  try {
    const appId = core.getInput('app-id')
    const jsonWebToken = core.getInput('json-web-token')
    const keyId = core.getInput('key-id')
    const issuerId = core.getInput('issuer-id')
    const privateKeyRaw = core.getInput('private-key-raw')
    const privateKeyFilePath = core.getInput('private-key-p8-path')
    const privateKeyFileBase64 = core.getInput('private-key-p8-base64')

    var tokenString = ''
    const token = new Token(privateKeyRaw, privateKeyFilePath, privateKeyFileBase64)
    token.verifyToken(jsonWebToken)
    if (!!jsonWebToken) {
      tokenString = jsonWebToken
      token.verifyToken(tokenString)
    } else {
      tokenString = token.generate(appId, issuerId, keyId)
    }

    const json = await request(appId, tokenString)
    const data = json.data

    if (data === undefined || data.length === 0) {
      throw new Error('Invalid request. Please check your inputs.')
    }

    if (data.length > 0) {
      setOutput(data, 0)
    }

    if (data.length === 2) {
      setOutput(data, 1)
    }
  } catch (error) {
    console.log(error)
    core.setFailed(error)
  }
}

function setOutput(data, index) {
  const attributes = data[index].attributes
  const version = attributes.versionString
  const state = attributes.appStoreState
  const type = index === 0 ? 'latest' : 'previous'
  console.log(`The App Store application ${type} version is ${version} with the state ${state}`)
  core.setOutput(`app-version-${type}`, version)
  core.setOutput(`app-state-${type}`, state)
}

run()
