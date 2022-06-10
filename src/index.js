import core from '@actions/core'
import Token from './token.js'
import request from './request.js'

async function run() {
  try {
    const appId = core.getInput('app-id')
    const keyId = core.getInput('key-id')
    const issuerId = core.getInput('issuer-id')
    const jsonWebToken = core.getInput('json-web-token')
    const privateKeyRaw = core.getInput('private-key-raw')
    const privateKeyFilePath = core.getInput('private-key-p8-path')
    const privateKeyFileBase64 = core.getInput('private-key-p8-base64')

    var tokenString = ''

    if (!!jsonWebToken) {
      tokenString = jsonWebToken
      console.log("Predefined Json Web Token has been set.")
    } else {
      console.log("Predefined Json Web Token hasn't been passed.")
      console.log("Setting up the private key...")
      const token = new Token(privateKeyRaw, privateKeyFilePath, privateKeyFileBase64)
      console.log("Starting automatic token generation...")
      tokenString = token.generate(appId, issuerId, keyId)
    }

    console.log("Sending App Store Connect API request...")
    const json = await request(appId, tokenString)
    const data = json.data

    if (data === undefined || data.length === 0) {
      throw new Error('Invalid request. Please check your inputs.')
    }

    console.log("App Store Connect API request was successful, proceeding...")

    if (data.length > 0) {
      console.log("Setting outputs for the latest app version...")
      setOutput(data, 0)
    }

    if (data.length === 2) {
      console.log("Setting outputs for the previous app version...")
      setOutput(data, 1)
    }

    console.log("The action finished successfully.")
  } catch (error) {
    console.log(error)
    console.log("The action finished with error.")
    core.setFailed(error)
  }
}

function setOutput(data, index) {
  const type = index === 0 ? 'latest' : 'previous'
  const attributes = data[index].attributes

  if (attributes == null) {
    throw new Error(`Something went wrong. Couldn't retrieve details for the ${type} app release...`)
  }

  const version = attributes.versionString
  const state = attributes.appStoreState
  const releaseType = attributes.releaseType
  const createdDate = attributes.createdDate
  console.log(`The ${type} App Store application version is ${version}`)
  console.log(`The ${type} App Store application state is ${state}`)
  console.log(`The ${type} App Store application release type is ${releaseType}`)
  console.log(`The ${type} App Store application release creation date is ${createdDate}`)
  core.setOutput(`app-version-${type}`, version)
  core.setOutput(`app-state-${type}`, state)
  core.setOutput(`app-release-type-${type}`, releaseType)
  core.setOutput(`version-created-date-${type}`, createdDate)
}

run()
