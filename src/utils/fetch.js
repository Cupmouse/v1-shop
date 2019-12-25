
const API_URL = '/api'

const post = (dir, data) => {
  return window.fetch(API_URL + dir, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {'Content-Type': 'application/json'},
    redirect: 'error',
    referrer: 'no-referrer',
    body: JSON.stringify(data),
  });
}

export const getItem = (ids) => {
  return post('/getitem', ids).then(res => res.json());
}

export const search = (query) => {
  return post('/search', query).then(res => res.json());
}

export const signup = (data) => {
  return post('/signup', data).then(res => res.json());
}

export const isLoggedin = (data) => {
  return post('isloggedin', data).then(res => res.json());
}