import fetch from 'node-fetch'

export const appstoreConnectApiRequest = async (path, jwt, limit) => {
  const url = `https://api.appstoreconnect.apple.com${path}?limit=${limit}`
  const response = await fetch(url, { headers: { 'Authorization': `Bearer ${jwt}` } })
  return await response.json()
}

export const itunesLookupRequest = async (bundleId, useHttps) => {
  const protocol = useHttps === 'true' ? "https" : "http"
  const url = `${protocol}://itunes.apple.com/lookup?bundleId=${bundleId}`
  const response = await fetch(url)
  return await response.json()
}
