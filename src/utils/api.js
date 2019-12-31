import { API_URL } from './variables';
import download from 'downloadjs';

const post = (dir, data) => {
  return window.fetch(API_URL + dir, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {'Content-Type': 'application/json'},
    redirect: 'error',
    referrer: 'no-referrer',
    body: JSON.stringify(data),
  });
}

export const cart = (ids) => {
  return post('/shop/cart', ids).then(res => res.json());
}

export const search = (query) => {
  return post('/shop/search', query).then(res => res.json());
}

export const signup = (data) => {
  return post('/user/signup', data).then(res => res.json());
}

export const login = (user_id, password, token) => {
  return post('/user/login', {user_id, password, token}).then(res => res.json())
}

export const isLoggedin = (user_id, session_id) => {
  return post('/user/isloggedin', {user_id, session_id}).then(res => res.json());
}

export const logout = (user_id, session_id) => {
  return post('/user/logout', {user_id, session_id}).then(res => res.json());
}

export const bought = (user_id, session_id) => {
  return post('/user/bought', {user_id, session_id}).then(res => res.json());
}

export const purchase = (user_id, session_id, order_id, ids) => {
  return post('/user/purchase', {user_id, session_id, order_id, ids}).then(res => res.json());
}

export const listorder = (user_id, session_id) => {
  return post('/user/listorder', {user_id, session_id}).then(res => res.json());
}

export const order = (user_id, session_id, order_id) => {
  return post('/order', {user_id, session_id, order_id}).then(res => res.json());
}

export const sample = (id, name) => {
  post('/shop/sample', {id})
  .then(res => res.blob())
  .then(blob => download(blob, name, 'text/plain'));
}
