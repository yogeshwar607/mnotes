const co = require('co');

const { userDAO } = rootRequire('commons').DAO;

const { getPaginationFilter } = rootRequire('commons').UTILS;

// const assert = require('assert');

function enrichFilters(filter) {
  filter.select = {
    client: 1,
    name: 1,
    email: 1,
    language: 1,
    roles: 1,
    client_access: 1,
  };
  return filter;
}

function searchQueryTemplate(q) {
  return [
    { name: { $regex: q, $options: 'i' } },
    { email: { $regex: q, $options: 'i' } },
    { language: { $regex: q, $options: 'i' } },
  ];
}

function* logic({ context, query }) {
  try {
    const _userDAO = userDAO();
    const filter = enrichFilters(getPaginationFilter(query));

    const baseQuery = {};
    let totalCountQuery = {};
    const populateQuery = { path: 'roles client client_access' };


    baseQuery.client = { $in: context.clientAccessIds };
    // TO DO :- Filters to be added here in baseQuery
    // total count query based on filters
    totalCountQuery = JSON.parse(JSON.stringify(baseQuery));
    if (filter.search.value) {
      baseQuery['$or'] = searchQueryTemplate(filter.search.value);
    }
    return yield _userDAO.findByPagination({ baseQuery, totalCountQuery, populateQuery }, filter);
  } catch (e) {
    throw e;
  }
}

function handler(req, res, next) {
  co(logic(req))
    .then((data) => {
      res.json({
        success: true,
        data,
      });
    })
    .catch(err => next(err));
}
module.exports = handler;