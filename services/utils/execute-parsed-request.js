const { throwAppError } = require('@app-core/errors');
const { ExecutedParsedRequestMessage } = require('@app-core/messages');
const axios = require('axios');
const Constants = require('./request-constants');

async function executeParsedRequest(parsed) {
  const start = Date.now();

  let response;
  try {
    if (parsed.method === Constants.GET) {
      response = await axios.get(parsed.full_url, { headers: parsed.headers });
    } else {
      response = await axios.post(parsed.url, parsed.body, { headers: parsed.headers });
    }
  } catch (err) {
    throwAppError(ExecutedParsedRequestMessage.EXECUTION_ERROR(err.message));
  }
  const stop = Date.now();

  return {
    request: {
      query: parsed.query,
      body: parsed.body,
      headers: parsed.headers,
      full_url: parsed.full_url,
    },
    response: {
      http_status: response.status,
      duration: stop - start,
      request_start_timestamp: start,
      request_stop_timestamp: stop,
      response_data: response.data,
    },
  };
}

module.exports = executeParsedRequest;
