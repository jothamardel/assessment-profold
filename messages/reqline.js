module.exports = {
  INVALID_SPACING: 'Invalid spacing around pipe delimiter',
  MISSING_SPACE: 'Missing space after keyword',
  HTTP_KEYWORD_UPPERCASE: 'HTTP method must be uppercase',
  INVALID_HTTP_METHOD: 'Invalid HTTP method. Only GET and POST are supported',
  INVALID_JSON_FORMAT: (keyword) => `Invalid JSON format in ${keyword} section`,
  MISSING_KEYWORD: (keyword) => `Missing required ${keyword} keyword`,
};
