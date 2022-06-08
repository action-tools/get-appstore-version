# App Store Connect latest & previous versions action

This action can be used to get the **latest** and the **previous** application version from the App Store. It calls [appStoreVersions](https://developer.apple.com/documentation/appstoreconnectapi/list_all_app_store_versions_for_an_app) request from the [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi).

## Usage

You can use this action simply by writing something like this:

```
on: [push]

jobs:
  job_test:
    runs-on: ubuntu-latest
    name: Job for action testing
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Get App Store Version \#1
        uses: ilyalehchylin/app-latest-version-appstore@v1.0
        with:
          app-id: ${{ secrets.APP_ID }}
          json-web-token: ${{ secrets.JSON_WEB_TOKEN }}
```

You can find some samples **[here](https://github.com/ilyalehchylin/app-latest-version-appstore/blob/develop/.github/workflows/main.yml)**.

## Action Inputs

There are no **default values** for the inputs.

| Input  | Required | Description |
| :--- | :--- | :--- |
| `app-id` | true | App Store application identifier  |
| `json-web-token` | false | JSON Web Token for the App Store API request  |
| `key-id` | false | Private key ID from App Store Connect  |
| `issuer-id` | false | Issuer ID from the API Keys page in App Store Connect  |
| `private-key-p8-path` | false | Private key file downloaded from the API Keys page in App Store Connect (\*.p8 file)  |
| `private-key-p8-base64` | false | Private key downloaded from the API Keys page in App Store Connect (\*.p8 file) in Base64 format  |
| `private-key-raw` | false | Raw private key downloaded from the API Keys page in App Store Connect  |

## Action Outputs

| Output | Description |
| :--- | :--- |
| `app-version-latest`  | Latest app version from the App Store  |
| `app-state-latest` | Latest app state from the App Store  |
| `app-version-previous` | Previous app version from the App Store  |
| `app-state-previous` | Previous app state from the App Store  |
