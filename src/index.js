const core = require('@actions/core')
const github = require('@actions/github')

try {
  const appId = core.getInput('app-id')
  const jwt = core.getInput('json-web-token')
  console.log(`Your application id on App Store is ${ appId }`)
  core.setOutput('app-version', '1.0.0')
} catch (error) {
  core.setFailed(error)
}
