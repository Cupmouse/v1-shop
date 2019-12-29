export const API_URL = process.env.NODE_ENV === 'production' ? 'http://shopapi.exchangedataset.cc' : 'http://localhost:3001';
export const HOME_URL = 'http://www.exchangedataset.cc';
export const PAYPAL_CLIENT_ID = process.env.NODE_ENV === 'production' ?
  'AfVrtn4Iog5c7b8cIRE7-QIHIBXkH8f4lRgMDlSBENNoQwF37_tos0kwMR9ZVQy2NSbOKk32lZ9X5doD' :
  'ATdZPSLf61TWnm1v7iYfTvVY0BtoitHdKxjZBHmUZmAXPZyp5U2x3KUCNoYn0d65eTzOCkRvSqotyv2z';