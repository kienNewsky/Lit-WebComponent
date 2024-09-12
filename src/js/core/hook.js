/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
export function asyncFetch(method, host, url, token, username, data) {
  if (data) {
    return fetch(`${host}${url}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        UserName: username,
      },
      body: JSON.stringify(data),
    });
  }
  return fetch(`${host}${url}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      UserName: username,
    },
  });
}

export function isValidDateStrict(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
  if (!regex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
