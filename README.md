# App Store Application Versions Action

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/action-tools/get-appstore-version/main.yml?branch=main)](https://github.com/action-tools/get-appstore-version/actions/workflows/main.yml)
[![GitHub Release](https://img.shields.io/github/v/release/action-tools/get-appstore-version?include_prereleases)](https://github.com/action-tools/get-appstore-version/releases/latest)

This action can be used to get the **latest** and the **previous** application version from the App Store. It calls [appStoreVersions](https://developer.apple.com/documentation/appstoreconnectapi/list_all_app_store_versions_for_an_app) request from the [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi).

## Prerequisites

You can choose which way to get your application version from AppStore:
* iTunes Lookup
* AppStore Connect API

### iTunes Lookup

With iTunes lookup you can only retrieve the latest version from AppStore which is released and marked as live. It's the fastest and the most simple way, because you need provide the application's bundle identifier (`bundle-id`) and a few configuration properties (`use-https` and `itunes-lookup-try-api-on-failure`).

The only outputs that you get from iTunes lookup are: `app-version-latest`, `version-created-date-latest`, `versions-output-json`.

**Note**: Do not forget to activate it with `is-itunes-lookup` (by default it's `false`).

#### How it works

With iTunes lookup a request to https://itunes.apple.com/lookup?bundleId=YOUR_BUNDLE_ID is sent. It doesn't require any authorization.

You can set `use-https` to `false` if you want to use HTTP endpoint (**Note**: if you release the app version, it takes about **24 hours** to get updated by `HTTP` endpoint. So if you want to get information immediately, please use `HTTPS`). By default `HTTPS` is used.

### AppStore Connect API

AppStore Connect API provides more details about your application (you can get info up to 200 versions).

To send an API request to the App Store Connect you must generate a **[Json Web Token](https://jwt.io/introduction)** with ES256 encryption. You can generate this token by yourself and then pass it to the action or you can generate it automatically.

#### Get App Id

To get the app id you can either navigate to your app in the App Store with your browser and check your url (`https://apps.apple.com/by/app/{app-name}/id{app-id}`) or navigate to your app in the **[App Store Connect](https://appstoreconnect.apple.com)**, then open **App Information** at the left column and find **Apple ID** there (under the **General Information**). This parameter is required to identify your application.

#### API Key Creation

1. First of all navigate to the **[App Store Connect](https://appstoreconnect.apple.com)**.
2. Open **[Users and Access](https://appstoreconnect.apple.com/access/users)**.
3. Select **Keys** tab.
4. Tap the "**+**" button.
5. Enter the name of your key (e.g. `your-app-name-api-key`) and select the desired role (e.g. `Developer`).
6. A new key will appear in your Keys list.
7. Tap "**Download API Key**" to download the `AuthKey_{key-id}.p8` file.  
   **Note**: You won't be able to download it afterwards.
8. Copy **Issuer ID** and **Key ID** on the same page.  
   **Note**: You will be able to copy them afterwards.

**Note**: It's suggested to store the sensitive information (like json web token, private key, key id and issuer id) as **[Github Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)** (please check also **[how to store files as secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#storing-base64-binary-blobs-as-secrets)**).

#### Json Web Token Generation

If you want to generate JWT manually, just refer to the **[Generating Tokens for API Requests](https://developer.apple.com/documentation/appstoreconnectapi/generating_tokens_for_api_requests)** article, then use something like **[token.dev](https://token.dev)** to create a token. All you should do is to pass `app-id` and `json-web-token` as the action's parameters.

In order to generate JWT automatically, you can just provide `app-id`, `issuer-id` and your private key. The private key can be provided as a raw string (`private-key-raw`), as a Base64 encoded \*.p8 file (`private-key-p8-base64`) or as a path to \*.p8 file (`private-key-p8-path`).

The priority of the parameters (which one will be used first) is the following: `json-web-token` > `private-key-raw` > `private-key-p8-path` > `private-key-p8-base64`.

## JSON Output

Both iTunes Lookup and AppStore Connect API have an output `versions-output-json` which contains all information that is parsed in action and even more (like app name, description, supported iOS, etc.). You can use this data and parse by yourself with **[fromJson](https://docs.github.com/en/actions/learn-github-actions/expressions#fromjson)** expression.

### Sample

```yaml
- name: 'Get Version from iTunes Lookup'
  uses: action-tools/get-appstore-version@v1.3
  id: itunes_case
    with:
      is-itunes-lookup: 'true'
      bundle-id: ${{ secrets.BUNDLE_ID }}
      use-https: 'true'
      itunes-lookup-try-api-on-failure: 'false'

- name: 'Get iTunes Lookup JSON Output'
  id: itunes_json
  run: |
    JSON_OUTPUT='${{ steps.itunes_case.outputs.versions-output-json }}'
    JSON_OUTPUT="${JSON_OUTPUT//'%'/'%25'}"
    JSON_OUTPUT="${JSON_OUTPUT//$'\n'/'%0A'}"
    JSON_OUTPUT="${JSON_OUTPUT//$'\r'/'%0D'}"
    echo "jsonOutput=$JSON_OUTPUT" >> $GITHUB_OUTPUT

- name: 'Get iTunes Lookup results'
  run: |
    echo "Parsed version from JSON: ${{ fromJson(steps.itunes_json.outputs.jsonOutput).results[0].version }}"
```

## Usage

You can use this action simply by writing something like this:

```yaml
on: [push]

jobs:
  job_test:
    runs-on: ubuntu-latest
    name: Job for action testing
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Get App Store Version with iTunes Lookup
        id: appstore_version
        uses: action-tools/get-appstore-version@v1.3
        with:
          is-itunes-lookup: true
          bundle-id: ${{ secrets.BUNDLE_ID }}
          use-https: true
          itunes-lookup-try-api-on-failure: false

      - name: Get App Store Version with AppStore Connect API
        id: appstore_version
        uses: action-tools/get-appstore-version@v1.3
        with:
          app-id: ${{ secrets.APP_ID }}
          key-id: ${{ secrets.KEY_ID }}
          issuer-id: ${{ secrets.ISSUER_ID }}
          json-web-token: ${{ secrets.JSON_WEB_TOKEN }}
          private-key-raw: ${{ secrets.PRIVATE_KEY_RAW }}
          private-key-p8-base64: ${{ secrets.PRIVATE_KEY_FILE_BASE64 }}
          private-key-p8-path: ./AuthKey.p8

      - name: Get results
        run: |
          echo "App Store latest version: ${{ steps.appstore_version.outputs.app-version-latest }}"
          echo "App Store latest state: ${{ steps.appstore_version.outputs.app-state-latest }}"
          echo "App Store latest release type: ${{ steps.appstore_version.outputs.app-release-type-latest }}"
          echo "App Store latest creation date: ${{ steps.appstore_version.outputs.version-created-date-latest }}"
          echo "App Store previous version: ${{ steps.appstore_version.outputs.app-version-previous }}"
          echo "App Store previous state: ${{ steps.appstore_version.outputs.app-state-previous }}"
          echo "App Store previous release type: ${{ steps.appstore_version.outputs.app-release-type-previous }}"
          echo "App Store previous creation date: ${{ steps.appstore_version.outputs.version-created-date-previous }}"
          echo "JSON output: ${{ steps.appstore_version.outputs.versions-output-json }}"
```

You can find some samples **[here](https://github.com/action-tools/app-latest-version-appstore/blob/develop/.github/workflows/main.yml)**.

## Action Inputs

| Input                              | Required | Default | Description                                                                           |
|:-----------------------------------| :---     | :---    |:--------------------------------------------------------------------------------------|
| `is-itunes-lookup`                 | false    | `false` | Should action use iTunes lookup endpoint or AppStore Connect API.                     |
| `bundle-id`                        | false    |         | Application bundle id (required for iTunes lookup only).                              |
| `use-https`                        | false    | `true`  | Use HTTPS or HTTP (for iTunes lookup only).                                           |
| `itunes-lookup-try-api-on-failure` | false    | `true`  | Try to call AppStore Connect API if iTunes lookup is failed (for iTunes lookup only). |
| `app-id`                           | false    |         | App Store application identifier.                                                     |
| `json-web-token`                   | false    |         | JSON Web Token for the App Store API request.                                         |
| `key-id`                           | false    |         | Private key ID from App Store Connect.                                                |
| `issuer-id`                        | false    |         | Issuer ID from the API Keys page in App Store Connect.                                |
| `private-key-p8-path`              | false    |         | Private key file downloaded from the API Keys page in App Store Connect (\*.p8 file). |
| `private-key-p8-base64`            | false    |         | Private key downloaded from the App Store Connect (\*.p8 file) in Base64 format.      |
| `private-key-raw`                  | false    |         | Raw private key downloaded from the API Keys page in App Store Connect.               |
| `from-build`                       | false    |         | Read version of build                                                                 |

## Action Outputs

| Output                          | Description                                                                                         |
| :---                            | :---                                                                                                |
| `app-version-latest`            | Latest app version, e.g. `1.0.1`.                                                                   |
| `app-state-latest`              | Latest app state. [Possible values](https://developer.apple.com/documentation/appstoreconnectapi/appstoreversionstate).                                                    |
| `app-release-type-latest`       | Latest app release type. Possible values: `MANUAL`, `AFTER_APPROVAL`, `SCHEDULED`.                  |
| `version-created-date-latest`   | Latest app version created date, e.g. `2022-06-08T02:47:00-07:00`.                                  |
| `app-version-previous`          | Previous app version, e.g. `1.0.0`.                                                                 |
| `app-state-previous`            | Previous app state. [Possible values](https://developer.apple.com/documentation/appstoreconnectapi/appstoreversionstate).                                                    |
| `app-release-type-previous`     | Previous app release type. Possible values: `MANUAL`, `AFTER_APPROVAL`, `SCHEDULED`.                |
| `version-created-date-previous` | Previous app version created date. `2022-04-29T10:03:06-07:00`.                                     |
| `versions-output-json`          | JSON request output.                                                                                |

## Contributing

Contributors are welcome! See **[CONTRIBUTING.md](https://github.com/action-tools/get-appstore-version/blob/main/CONTRIBUTING.md)** for additional instructions.
