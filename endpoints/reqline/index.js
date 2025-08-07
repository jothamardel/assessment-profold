const { createHandler } = require('@app-core/server');
const parseReqline = require('../../services/reqline');
const { executionParsedRequest } = require('../../services/utils');

module.exports = createHandler({
  path: '/reqline',
  method: 'post',
  async handler(rc, helpers) {
    const payload = rc.body;
    const response = await parseReqline(payload);
    const executionResult = await executionParsedRequest(response);
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      data: executionResult,
    };
  },
});
