import fetch from 'node-fetch'

export const appstoreConnectApiRequest = async (appId, jwt, limit) => {
  const url = `https://api.appstoreconnect.apple.com/v1/apps/${appId}/appStoreVersions?limit=${limit}`
  const response = await fetch(url, { headers: { 'Authorization': `Bearer ${jwt}` } })
  return await response.json()
}

export const itunesLookupRequest = async (bundleId, useHttps) => {
  const protocol = useHttps ? "https" : "http"
  const url = `${protocol}://itunes.apple.com/lookup?bundleId=${bundleId}`
  const response = await fetch(url)
  return await response.json()
}
