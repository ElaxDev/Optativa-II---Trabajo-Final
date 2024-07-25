import axios from 'axios';

const BASE_URL = '/api/';
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export async function registerUserFn(user) {
  const { data } = await api.post('auth/register', user);
  return data;
}

export async function loginUserFn(user) {
  const { data } = await api.post('auth/login', user);
  return data;
}

export async function logoutUserFn() {
  const { data } = await api.post('auth/logout');
  return data;
}

export async function updateItemFn(id, updateValues) {
  console.log('updateValues', updateValues);
  const { data } = await api.put(`/item/${id}`, updateValues);
  return data;
}

export async function getItemsFn() {
  const { data } = await api.get(`/item`);
  return data;
}

export async function createItemFn(itemValues) {
  const { data } = await api.post(`item`, itemValues);
  return data;
}

export async function deleteItemFn(id) {
  const { data } = await api.delete(`item/${id}`);
  return data;
}
