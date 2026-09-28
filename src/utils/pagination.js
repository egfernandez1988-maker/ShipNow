const { PAGINATION } = require('../constants');
const { ValidationError } = require('../errors/app.error');

function parsePagination({ page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT }) {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedPage) || !Number.isInteger(parsedLimit) || parsedPage < 1 || parsedLimit < 1 || parsedLimit > PAGINATION.MAX_LIMIT) {
    throw new ValidationError(`page debe ser mayor a 0 y limit debe estar entre 1 y ${PAGINATION.MAX_LIMIT}`);
  }

  return { page: parsedPage, limit: parsedLimit, skip: (parsedPage - 1) * parsedLimit };
}

function buildPaginatedResponse(data, total, { page, limit }) {
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

module.exports = { parsePagination, buildPaginatedResponse };
