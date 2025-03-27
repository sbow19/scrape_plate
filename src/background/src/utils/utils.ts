/**
 * Helper functions
 */

export function backendResponseFactory(
  message: BackendMessage,
  data: any
): BackendResponse {
  const responseBody: BackendResponse = {};

  if (message.operation === "database") {
    responseBody.operation = "database";

    const databaseResult = data as DBOperationResult;

    responseBody.data = {
      type: databaseResult.type,
      method: databaseResult.method,
      success: databaseResult.success,
      payload: databaseResult?.data ?? null,
      message: databaseResult.message,
    };

  } else if (message.operation === 'getCurrentTab'){
    responseBody.operation === 'getCurrentTab'

    const tabResult = data as chrome.tabs.Tab

    responseBody.data = tabResult
  }

  return responseBody;
}

export function getCurrentTab(): Promise<chrome.tabs.Tab> {
  return new Promise(async (resolve) => {
    const queryOptions = {
      active: true,
    };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    chrome.tabs.query(queryOptions).then(([tab]) => {
      resolve(tab);
    });
  });
}

export function getMatchingSchemas(
  schemaObject: {
    [key: string]: Schema;
  },
  urlToMatch: string
): Array<Schema> {
  const schemasList = Object.values(schemaObject);
  if (schemasList.length === 0) return [];
  if (!urlToMatch) return []

  let matchingSchemas = [];

  // Check whether url matches any schema urls
  for (let schema of schemasList) {
    if (urlToMatch.includes(schema.url_match)) matchingSchemas.push(schema);
  }

  return matchingSchemas
}
