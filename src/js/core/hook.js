/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
export function asyncFetch(method, host, url, token, username, data) {
  if (data) {
      return fetch(`${host}${url}`, {
          method: method,
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              UserName: username,
          },
          body: JSON.stringify(data),
      });
  }
      return fetch(`${host}${url}`, {
          method: method,
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              UserName: username,
          },
      });

}
