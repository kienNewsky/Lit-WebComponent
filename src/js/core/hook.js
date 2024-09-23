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

export const measCat = [
  { value: 1, name: 'Diện tích' },
  { value: 2, name: 'Chiều dài' },
  { value: 3, name: 'Khối lượng' },
  { value: 4, name: 'Đơn lẻ' },
  { value: 5, name: 'Thể tích' },
];

export const productGroup = [
  { value: 'Laminate flooring', name: 'Sàn Laminate' },
  { value: 'Laminate skirting', name: 'Phào Laminate' },
  { value: 'Impregnated paper', name: 'Tẩm giấy' },
  { value: 'Wooden door', name: 'Cửa gỗ công nghiệp' },
  { value: 'WPU flooring', name: 'Sàn WPU' },
  { value: 'SPC flooring', name: 'Sàn SPC' },
  { value: 'Multi Layer flooring', name: 'Sàn gỗ dán mặt melamin' },
];
