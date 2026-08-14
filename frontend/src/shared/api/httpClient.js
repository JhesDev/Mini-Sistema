import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    const apiError = error.response?.data?.error;
    const message =
      apiError?.message ??
      error.message ??
      'Error de comunicación con el servidor';

    const details = apiError?.details;
    const enriched = new Error(message);
    enriched.code = apiError?.code ?? 'NETWORK_ERROR';
    enriched.status = error.response?.status;
    enriched.details = details;
    return Promise.reject(enriched);
  },
);

export async function get(url, params) {
  const { data } = await httpClient.get(url, { params });
  return data;
}

export async function post(url, body) {
  const { data } = await httpClient.post(url, body);
  return data;
}

export async function put(url, body) {
  const { data } = await httpClient.put(url, body);
  return data;
}

export async function patch(url, body) {
  const { data } = await httpClient.patch(url, body);
  return data;
}

export async function del(url) {
  await httpClient.delete(url);
}

export default httpClient;
