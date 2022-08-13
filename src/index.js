import core from '@actions/core'
import request from './request.js'
import Utils from './utils.js'

async function run() {
  try {
    const appId = core.getInput('app-id')
    const keyId = core.getInput('key-id')
    const issuerId = core.getInput('issuer-id')
    const jsonWebToken = core.getInput('json-web-token')
    const privateKeyRaw = core.getInput('private-key-raw')
    const privateKeyFilePath = core.getInput('private-key-p8-path')
    const privateKeyFileBase64 = core.getInput('private-key-p8-base64')
    const versionsLimit = core.getInput('versions-limit')

    const utils = new Utils()
    const tokenString = utils.getToken(
      appId, 
      issuerId, 
      keyId, 
      jsonWebToken, 
      privateKeyRaw, 
      privateKeyFilePath, 
      privateKeyFileBase64)

    const limit = utils.getLimit(versionsLimit)

    console.log("Sending App Store Connect API request...")
    const json = await request(appId, tokenString, limit)
    const data = json.data

    if (data === undefined || data.length === 0) {
      throw new Error('Invalid request. Please check your inputs.')
    }

    console.log("App Store Connect API request was successful, proceeding...")

    if (data.length > 0) {
      console.log("Setting outputs for the latest app version...")
      setOutput(data, 0, json)
    }

    if (data.length === 2) {
      console.log("Setting outputs for the previous app version...")
      setOutput(data, 1, json)
    }

    console.log("The action finished successfully.")
  } catch (error) {
    console.log(error)
    console.log("The action finished with error.")
    core.setFailed(error)
  }
}

function setOutput(data, index, jsonOutput) {
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
  console.log(`The API response output in JSON format:\n\n${jsonOutput}`)
  core.setOutput(`app-version-${type}`, version)
  core.setOutput(`app-state-${type}`, state)
  core.setOutput(`app-release-type-${type}`, releaseType)
  core.setOutput(`version-created-date-${type}`, createdDate)
  core.setOutput(`versions-output-json`, jsonOutput)
}

run()
