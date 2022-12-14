import core from '@actions/core'
import util from 'node:util'
import { appstoreConnectApiRequest, itunesLookupRequest } from './request.js'
import Utils from './utils.js'
import { messages } from './messages.js'

async function run() {
  const isItunesLookup = core.getInput('is-itunes-lookup')
  if (isItunesLookup === 'false') {
    console.log('itunes')
  } else {
    console.log('api')
  }
  isItunesLookup ? await itunesLookup() : await appstoreConnectApi()
}

async function itunesLookup() {
  try {
    const bundleId = core.getInput('bundle-id')
    const useHttps = core.getInput('use-https')

    if (!bundleId) {
      console.log(messages.bundle_id_not_defined)

      if (!await tryAppStoreConnectApi()) {
        throw new Error(messages.itunes_lookup_bundle_id_error)
      }
    }

    console.log(messages.sending_itunes_lookup_request)
    const jsonObject = await itunesLookupRequest(bundleId, useHttps)
    const resultFailure = jsonObject.resultCount === undefined || jsonObject.resultCount < 1

    if (resultFailure && !await tryAppStoreConnectApi()) {
      throw new Error(messages.itunes_lookup_general_error)
    }

    console.log(messages.itunes_lookup_request_success)
    const jsonOutput = JSON.stringify(jsonObject)
    const result = jsonObject.results[0]
    const version = result.version
    const createdDate = result.currentVersionReleaseDate
    core.setOutput(`app-version-latest`, version)
    core.setOutput(`version-created-date-latest`, createdDate)
    core.setOutput(`versions-output-json`, jsonOutput)
    console.log(messages.action_success)
  } catch (error) {
    console.log(error)
    console.log(messages.action_failed_error)
    core.setFailed(error)
  }
}

async function appstoreConnectApi() {
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
    console.log(messages.sending_appstore_connect_request)
    const jsonObject = await appstoreConnectApiRequest(appId, tokenString, limit)

    if (jsonObject.errors !== undefined && jsonObject.errors.length > 0) {
      const error = jsonObject.errors[0];
      throw new Error(`${messages.request_failed_with_message}:
      id: ${error.id}
      status: ${error.status}
      title: ${error.title}
      code: ${error.code}
      detail: ${error.detail}`)
    }

    const jsonOutput = JSON.stringify(jsonObject)
    const data = jsonObject.data

    if (data === undefined || data.length === 0) {
      throw new Error(messages.invalid_request)
    }

    console.log(messages.appstore_connect_api_request_success)

    if (data.length > 0) {
      console.log(messages.setting_outputs_latest)
      setOutput(data, 0)
    }

    if (data.length > 1) {
      console.log(messages.setting_outputs_previous)
      setOutput(data, 1)
    }

    core.setOutput(`versions-output-json`, jsonOutput)
    console.log(messages.action_success)
  } catch (error) {
    console.log(error)
    console.log(messages.action_failed_error)
    core.setFailed(error)
  }
}

async function tryAppStoreConnectApi() {
  const tryApiOnFailure = core.getInput('itunes-lookup-try-api-on-failure')

  if (tryApiOnFailure === true) {
    console.log(messages.trying_appstore_connect_api_on_failure)
    await appstoreConnectApi()
    return true
  }

  return false
}

function setOutput(data, index) {
  const type = index === 0 ? 'latest' : 'previous'
  const attributes = data[index].attributes

  if (attributes == null) {
    const message = util.format(messages.set_output_error, 'latest')
    throw new Error(message)
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
}

run()
