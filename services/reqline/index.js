const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { ReqlineMessages } = require('@app-core/messages');
const validator = require('@app-core/validator');
const Constants = require('../utils/request-constants');

const parsedSpec = validator.parse(`root{
  reqline is a required string
}`);

async function parseReqline(url) {
  const data = validator.validate(url, parsedSpec);

  const sections = data.reqline.split('|');

  const parsed = {
    method: null,
    url: null,
    headers: {},
    query: {},
    body: {},
  };

  const sectionOrder = [];

  for (let i = 0; i < sections.length; i++) {
    let section = sections[i];
    if (!section.startsWith(' ') || !section.endsWith(' ')) {
      throwAppError(ReqlineMessages.INVALID_SPACING, ERROR_CODE.INVLDDATA);
    }

    section = section.trim();
    const spaceIndex = section.indexOf(' ');

    if (spaceIndex === -1) {
      throwAppError(ReqlineMessages.MISSING_SPACE, ERROR_CODE.INVLDDATA);
    }

    const keyword = section.substring(0, spaceIndex);
    const value = section.substring(spaceIndex + 1);

    if (!Object.keys(Constants).includes(keyword)) {
      throwAppError(ReqlineMessages.HTTP_KEYWORD_UPPERCASE, ERROR_CODE.INVLDDATA);
    }

    sectionOrder.push(keyword);

    switch (keyword) {
      case Constants.HTTP:
        if (value !== Constants.GET && value !== Constants.POST) {
          throwAppError(ReqlineMessages.INVALID_HTTP_METHOD, ERROR_CODE.INVLDDATA);
        }
        parsed.method = value;
        break;

      case Constants.URL:
        parsed.url = value;
        break;

      case Constants.HEADERS:
      case Constants.QUERY:
      case Constants.BODY:
        try {
          parsed[keyword.toLowerCase()] = JSON.parse(value);
        } catch (err) {
          throwAppError(ReqlineMessages.INVALID_JSON_FORMAT(keyword), ERROR_CODE.INVLDDATA);
        }
        break;

      default:
        break;
    }
  }

  if (!sectionOrder.includes(Constants.HTTP))
    throwAppError(ReqlineMessages.MISSING_KEYWORD(Constants.HTTP), ERROR_CODE.INVLDDATA);
  if (!sectionOrder.includes(Constants.URL))
    throwAppError(ReqlineMessages.MISSING_KEYWORD(Constants.URL), ERROR_CODE.INVLDDATA);

  parsed.full_url = parsed.url;
  const queryKeys = Object.keys(parsed.query);
  if (queryKeys.length > 0) {
    const queryString = queryKeys
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(parsed.query[k])}`)
      .join('&');
    parsed.full_url += `?${queryString}`;
  }

  return parsed;
}

module.exports = parseReqline;
