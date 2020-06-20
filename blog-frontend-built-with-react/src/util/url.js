import queryString from 'query-string';

export const getQuery = () => {
  const search = window.location.search;
  const query = queryString.parse(search);
  return query;
}
