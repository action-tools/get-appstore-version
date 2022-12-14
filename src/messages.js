export const messages = Object.freeze({
  bundle_id_not_defined: "Bundle id is not defined for iTunes lookup.",
  sending_itunes_lookup_request: "Sending iTunes lookup request...",
  itunes_lookup_request_success: "iTunes lookup request was successful, proceeding...",
  trying_appstore_connect_api_on_failure: "Trying to get application version via AppStore Connect API...",
  itunes_lookup_bundle_id_error: "In order to use iTunes lookup you need to provide correct bundle id or you can use 'itunes-lookup-try-api-on-failure' parameter to call AppStore Connect API on iTunes lookup failures",
  itunes_lookup_general_error: "Couldn't find any information on your request. You can use 'itunes-lookup-try-api-on-failure' parameter to call AppStore Connect API on iTunes lookup failures",
  action_failed_error: "The action finished with error.",
  sending_appstore_connect_request: "Sending App Store Connect API request...",
  request_failed_with_message: "Request failed with message",
  invalid_request: "Invalid request. Please check your inputs.",
  appstore_connect_api_request_success: "App Store Connect API request was successful, proceeding...",
  setting_outputs_latest: "Setting outputs for the latest app version...",
  setting_outputs_previous: "Setting outputs for the previous app version...",
  action_success: "The action finished successfully.",
  set_output_error: "Something went wrong. Couldn't retrieve details for the %s app release...",
  appstore_version: "The %s App Store application version is %s",
  appstore_state: "The %s App Store application state is %s",
  appstore_release_type: "The %s App Store application release type is %s",
  appstore_version_created_date: "The %s App Store application release creation date is %s",
  json_output: "The API response output in JSON format:\n\n%s",
  json_output_generated: "The JSON output is successfully generated. You can access it with 'versions-output-json' output property."
})
